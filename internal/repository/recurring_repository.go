package repository

import (
	"money-manager/internal/domain"
	"money-manager/internal/dto"
	"time"

	"gorm.io/gorm"
)

type RecurringTransactionRepository struct {
	db *gorm.DB
}

func NewRecurringTransactionRepository(db *gorm.DB) *RecurringTransactionRepository {
	return &RecurringTransactionRepository{db: db}
}

func (r *RecurringTransactionRepository) WithTx(tx *gorm.DB) *RecurringTransactionRepository {
	return &RecurringTransactionRepository{db: tx}
}

func (r *RecurringTransactionRepository) Create(rt *domain.RecurringTransaction) error {
	return r.db.Create(rt).Error
}

func (r *RecurringTransactionRepository) GetByUserID(userID string, query dto.PaginationQuery) ([]domain.RecurringTransaction, int64, error) {
	var rts []domain.RecurringTransaction
	var total int64

	db := r.db.Model(&domain.RecurringTransaction{}).Where("user_id = ?", userID)

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (query.Page - 1) * query.Limit
	err := db.Limit(query.Limit).Offset(offset).Find(&rts).Error

	return rts, total, err
}

func (r *RecurringTransactionRepository) GetByID(id string, userID string) (*domain.RecurringTransaction, error) {
	var rt domain.RecurringTransaction
	err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&rt).Error
	if err != nil {
		return nil, err
	}
	return &rt, nil
}

func (r *RecurringTransactionRepository) Update(rt *domain.RecurringTransaction) error {
	return r.db.Save(rt).Error
}

func (r *RecurringTransactionRepository) Delete(id string, userID string) error {
	result := r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&domain.RecurringTransaction{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (r *RecurringTransactionRepository) GetDueTransactions(now time.Time) ([]domain.RecurringTransaction, error) {
	var rts []domain.RecurringTransaction
	err := r.db.Where("is_active = ? AND next_run_date <= ?", true, now).Find(&rts).Error
	return rts, err
}
