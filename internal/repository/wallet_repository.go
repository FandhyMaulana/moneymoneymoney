package repository

import (
	"money-manager/internal/domain"
	"money-manager/internal/dto"

	"gorm.io/gorm"
)

type WalletRepository struct {
	db *gorm.DB
}

func NewWalletRepository(db *gorm.DB) *WalletRepository {
	return &WalletRepository{db: db}
}

func (r *WalletRepository) WithTx(tx *gorm.DB) *WalletRepository {
	return &WalletRepository{db: tx}
}

func (r *WalletRepository) Create(wallet *domain.Wallet) error {
	return r.db.Create(wallet).Error
}

func (r *WalletRepository) GetByUserID(userID string, query dto.PaginationQuery) ([]domain.Wallet, int64, error) {
	var wallets []domain.Wallet
	var total int64

	db := r.db.Model(&domain.Wallet{}).Where("user_id = ? AND deleted_at IS NULL", userID)

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (query.Page - 1) * query.Limit
	err := db.Limit(query.Limit).Offset(offset).Find(&wallets).Error
	return wallets, total, err
}

func (r *WalletRepository) GetByID(id string, userID string) (*domain.Wallet, error) {
	var wallet domain.Wallet
	err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&wallet).Error
	if err != nil {
		return nil, err
	}
	return &wallet, nil
}

func (r *WalletRepository) Update(wallet *domain.Wallet) error {
	return r.db.Save(wallet).Error
}

func (r *WalletRepository) UpdateBalance(id string, userID string, amount float64) error {
	return r.db.Model(&domain.Wallet{}).Where("id = ? AND user_id = ?", id, userID).
		Update("balance", gorm.Expr("balance + ?", amount)).Error
}

func (r *WalletRepository) Delete(id string, userID string) error {
	result := r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&domain.Wallet{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
