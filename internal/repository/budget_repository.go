package repository

import (
	"money-manager/internal/domain"
	"money-manager/internal/dto"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type BudgetRepository struct {
	db *gorm.DB
}

func NewBudgetRepository(db *gorm.DB) *BudgetRepository {
	return &BudgetRepository{db: db}
}

func (r *BudgetRepository) WithTx(tx *gorm.DB) *BudgetRepository {
	return &BudgetRepository{db: tx}
}

func (r *BudgetRepository) Upsert(budget *domain.Budget) error {
	now := time.Now()
	budget.UpdatedAt = &now

	// Use OnConflict to handle update if (user_id, category_id, period_month, period_year) exists
	return r.db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "user_id"}, {Name: "category_id"}, {Name: "period_month"}, {Name: "period_year"}},
		DoUpdates: clause.AssignmentColumns([]string{"amount", "updated_at"}),
	}).Clauses(clause.Returning{}).Create(budget).Error
}

func (r *BudgetRepository) GetBudgetsWithSpending(userID string, month, year int) ([]dto.BudgetDetailResponse, error) {
	var results []dto.BudgetDetailResponse

	// Join budgets with categories and a subquery for transaction sums
	err := r.db.Table("budgets").
		Select("budgets.id, budgets.category_id, categories.name as category_name, budgets.amount as budget_limit, COALESCE(spent_data.total, 0) as spent").
		Joins("JOIN categories ON categories.id = budgets.category_id").
		Joins("LEFT JOIN (SELECT category_id, SUM(amount) as total FROM transactions WHERE user_id = ? AND type = ? AND EXTRACT(MONTH FROM transaction_date) = ? AND EXTRACT(YEAR FROM transaction_date) = ? AND deleted_at IS NULL GROUP BY category_id) as spent_data ON spent_data.category_id = budgets.category_id", userID, domain.TransactionTypeExpense, month, year).
		Where("budgets.user_id = ? AND budgets.period_month = ? AND budgets.period_year = ?", userID, month, year).
		Scan(&results).Error

	return results, err
}

func (r *BudgetRepository) GetByUserID(userID string) ([]domain.Budget, error) {
	var budgets []domain.Budget
	err := r.db.Where("user_id = ?", userID).Find(&budgets).Error
	return budgets, err
}

func (r *BudgetRepository) GetByPeriod(userID string, month int, year int) ([]domain.Budget, error) {
	var budgets []domain.Budget
	err := r.db.Where("user_id = ? AND period_month = ? AND period_year = ?", userID, month, year).Find(&budgets).Error
	return budgets, err
}

func (r *BudgetRepository) Delete(id string, userID string) error {
	result := r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&domain.Budget{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
