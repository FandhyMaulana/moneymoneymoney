package repository

import (
	"money-manager/internal/domain"
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
