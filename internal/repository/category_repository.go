package repository

import (
	"money-manager/internal/domain"
	"money-manager/internal/dto"

	"gorm.io/gorm"
)

type CategoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) *CategoryRepository {
	return &CategoryRepository{db: db}
}

func (r *CategoryRepository) WithTx(tx *gorm.DB) *CategoryRepository {
	return &CategoryRepository{db: tx}
}

func (r *CategoryRepository) Create(category *domain.Category) error {
	return r.db.Create(category).Error
}

func (r *CategoryRepository) GetAllByUserID(userID string, query dto.PaginationQuery) ([]domain.Category, int64, error) {
	var categories []domain.Category
	var total int64

	// Get system categories OR user-specific categories
	db := r.db.Model(&domain.Category{}).Where("(user_id = ? OR is_system = ?) AND deleted_at IS NULL", userID, true)

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (query.Page - 1) * query.Limit
	err := db.Limit(query.Limit).Offset(offset).Find(&categories).Error

	return categories, total, err
}

func (r *CategoryRepository) GetByID(id string, userID string) (*domain.Category, error) {
	var category domain.Category
	err := r.db.Where("id = ? AND (user_id = ? OR is_system = ?)", id, userID, true).First(&category).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *CategoryRepository) Delete(id string, userID string) error {
	// Only allow deleting non-system categories owned by the user
	result := r.db.Where("id = ? AND user_id = ? AND is_system = ?", id, userID, false).Delete(&domain.Category{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
