package repository

import (
	"money-manager/internal/domain"

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

func (r *WalletRepository) GetByUserID(userID string) ([]domain.Wallet, error) {
	var wallets []domain.Wallet
	err := r.db.Where("user_id = ?", userID).Find(&wallets).Error
	return wallets, err
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
