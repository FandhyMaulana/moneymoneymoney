package repository

import (
	"money-manager/internal/domain"
	"money-manager/internal/dto"

	"gorm.io/gorm"
)

type TransactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) *TransactionRepository {
	return &TransactionRepository{db: db}
}

func (r *TransactionRepository) WithTx(tx *gorm.DB) *TransactionRepository {
	return &TransactionRepository{db: tx}
}

func (r *TransactionRepository) Create(tx *domain.Transaction) error {
	return r.db.Create(tx).Error
}

func (r *TransactionRepository) GetByUserID(userID string, query dto.TransactionQuery) ([]domain.Transaction, int64, error) {
	var txs []domain.Transaction
	var total int64

	db := r.db.Model(&domain.Transaction{}).Where("user_id = ?", userID)

	// Filters
	if query.Type != nil {
		db = db.Where("type = ?", *query.Type)
	}
	if query.CategoryID != nil {
		db = db.Where("category_id = ?", *query.CategoryID)
	}
	if query.WalletID != nil {
		db = db.Where("(source_wallet_id = ? OR destination_wallet_id = ?)", *query.WalletID, *query.WalletID)
	}
	if query.Month != nil {
		db = db.Where("EXTRACT(MONTH FROM transaction_date) = ?", *query.Month)
	}
	if query.Year != nil {
		db = db.Where("EXTRACT(YEAR FROM transaction_date) = ?", *query.Year)
	}
	if query.StartDate != nil {
		db = db.Where("transaction_date >= ?", *query.StartDate)
	}
	if query.EndDate != nil {
		db = db.Where("transaction_date <= ?", *query.EndDate)
	}

	// Count total before pagination
	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Sorting
	switch query.Sort {
	case "oldest":
		db = db.Order("transaction_date ASC")
	case "highest":
		db = db.Order("amount DESC")
	case "lowest":
		db = db.Order("amount ASC")
	default: // newest
		db = db.Order("transaction_date DESC")
	}

	// Pagination
	offset := (query.Page - 1) * query.Limit
	err := db.Limit(query.Limit).Offset(offset).Find(&txs).Error

	return txs, total, err
}

func (r *TransactionRepository) GetMonthlyTotals(userID string, month, year int) (float64, float64, error) {
	type Result struct {
		Type  string
		Total float64
	}
	var results []Result

	err := r.db.Model(&domain.Transaction{}).
		Select("type, SUM(amount) as total").
		Where("user_id = ? AND EXTRACT(MONTH FROM transaction_date) = ? AND EXTRACT(YEAR FROM transaction_date) = ? AND type != 'transfer'", userID, month, year).
		Group("type").
		Scan(&results).Error

	if err != nil {
		return 0, 0, err
	}

	var income, expense float64
	for _, res := range results {
		if res.Type == domain.TransactionTypeIncome {
			income = res.Total
		} else if res.Type == domain.TransactionTypeExpense {
			expense = res.Total
		}
	}

	return income, expense, nil
}

func (r *TransactionRepository) GetTopExpenseCategory(userID string, month, year int) (*dto.CategorySpending, error) {
	var result struct {
		ID     string
		Name   string
		Amount float64
	}

	err := r.db.Table("transactions").
		Select("categories.id, categories.name, SUM(transactions.amount) as amount").
		Joins("JOIN categories ON categories.id = transactions.category_id").
		Where("transactions.user_id = ? AND transactions.type = ? AND EXTRACT(MONTH FROM transactions.transaction_date) = ? AND EXTRACT(YEAR FROM transactions.transaction_date) = ?", userID, domain.TransactionTypeExpense, month, year).
		Group("categories.id, categories.name").
		Order("amount DESC").
		Limit(1).
		Scan(&result).Error

	if err != nil {
		return nil, err
	}

	if result.ID == "" {
		return nil, nil
	}

	return &dto.CategorySpending{
		ID:     result.ID,
		Name:   result.Name,
		Amount: result.Amount,
	}, nil
}

func (r *TransactionRepository) GetCategoryBreakdown(userID string, month, year int) ([]dto.CategorySpending, error) {
	var results []dto.CategorySpending

	err := r.db.Table("transactions").
		Select("categories.id, categories.name, SUM(transactions.amount) as amount").
		Joins("JOIN categories ON categories.id = transactions.category_id").
		Where("transactions.user_id = ? AND transactions.type = ? AND EXTRACT(MONTH FROM transactions.transaction_date) = ? AND EXTRACT(YEAR FROM transactions.transaction_date) = ?", userID, domain.TransactionTypeExpense, month, year).
		Group("categories.id, categories.name").
		Order("amount DESC").
		Scan(&results).Error

	return results, err
}

func (r *TransactionRepository) GetMonthlyTransactionCount(userID string, month, year int) (int64, error) {
	var count int64
	err := r.db.Model(&domain.Transaction{}).
		Where("user_id = ? AND EXTRACT(MONTH FROM transaction_date) = ? AND EXTRACT(YEAR FROM transaction_date) = ?", userID, month, year).
		Count(&count).Error
	return count, err
}

func (r *TransactionRepository) GetByID(id string, userID string) (*domain.Transaction, error) {
	var tx domain.Transaction
	err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&tx).Error
	if err != nil {
		return nil, err
	}
	return &tx, nil
}

func (r *TransactionRepository) Delete(id string, userID string) error {
	result := r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&domain.Transaction{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
