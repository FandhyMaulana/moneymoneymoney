package repository

import (
	"money-manager/internal/domain"

	"gorm.io/gorm"
)

type CategoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) *CategoryRepository {
	return &CategoryRepository{db: db}
}

func (r *CategoryRepository) Create(category *domain.Category) error {
	return r.db.Create(category).Error
}

func (r *CategoryRepository) GetAllByUserID(userID string) ([]domain.Category, error) {
	var categories []domain.Category
	// Get system categories OR user-specific categories
	err := r.db.Where("user_id = ? OR is_system = ?", userID, true).Find(&categories).Error
	return categories, err
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
