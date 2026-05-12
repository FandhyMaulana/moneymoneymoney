package service

import (
	"money-manager/internal/domain"
	"money-manager/internal/dto"
	"money-manager/internal/repository"
)

type CategoryService struct {
	repo *repository.CategoryRepository
}

func NewCategoryService(repo *repository.CategoryRepository) *CategoryService {
	return &CategoryService{repo: repo}
}

func (s *CategoryService) CreateCategory(userID string, req dto.CreateCategoryRequest) (*dto.CategoryResponse, error) {
	category := &domain.Category{
		UserID:   userID,
		Name:     req.Name,
		ParentID: req.ParentID,
		IsSystem: false,
	}

	if err := s.repo.Create(category); err != nil {
		return nil, err
	}

	return &dto.CategoryResponse{
		ID:        category.ID,
		Name:      category.Name,
		ParentID:  category.ParentID,
		IsSystem:  category.IsSystem,
		CreatedAt: category.CreatedAt.Format("2006-01-02 15:04:05"),
	}, nil
}

func (s *CategoryService) GetUserCategories(userID string) ([]dto.CategoryResponse, error) {
	categories, err := s.repo.GetAllByUserID(userID)
	if err != nil {
		return nil, err
	}

	var res []dto.CategoryResponse
	for _, c := range categories {
		res = append(res, dto.CategoryResponse{
			ID:        c.ID,
			Name:      c.Name,
			ParentID:  c.ParentID,
			IsSystem:  c.IsSystem,
			CreatedAt: c.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	return res, nil
}

func (s *CategoryService) DeleteCategory(id string, userID string) error {
	return s.repo.Delete(id, userID)
}
