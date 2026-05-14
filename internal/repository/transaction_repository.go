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
