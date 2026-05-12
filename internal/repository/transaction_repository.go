package repository

import (
	"money-manager/internal/domain"

	"gorm.io/gorm"
)

type TransactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) *TransactionRepository {
	return &TransactionRepository{db: db}
}

func (r *TransactionRepository) Create(tx *domain.Transaction) error {
	return r.db.Create(tx).Error
}

func (r *TransactionRepository) GetByUserID(userID string) ([]domain.Transaction, error) {
	var txs []domain.Transaction
	err := r.db.Where("user_id = ?", userID).Order("transaction_date DESC").Find(&txs).Error
	return txs, err
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
	return r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&domain.Transaction{}).Error
}
