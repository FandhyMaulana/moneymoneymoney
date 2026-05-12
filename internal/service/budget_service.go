package service

import (
	"errors"
	"money-manager/internal/domain"
	"money-manager/internal/dto"
	"money-manager/internal/repository"
)

type BudgetService struct {
	repo         *repository.BudgetRepository
	categoryRepo *repository.CategoryRepository
}

func NewBudgetService(repo *repository.BudgetRepository, categoryRepo *repository.CategoryRepository) *BudgetService {
	return &BudgetService{
		repo:         repo,
		categoryRepo: categoryRepo,
	}
}

func (s *BudgetService) SetBudget(userID string, req dto.UpsertBudgetRequest) (*dto.BudgetResponse, error) {
	// 1. Validate Category
	_, err := s.categoryRepo.GetByID(req.CategoryID, userID)
	if err != nil {
		return nil, errors.New("invalid category")
	}

	// 2. Prepare Budget
	budget := &domain.Budget{
		UserID:      userID,
		CategoryID:  req.CategoryID,
		Amount:      req.Amount,
		PeriodMonth: req.PeriodMonth,
		PeriodYear:  req.PeriodYear,
	}

	// 3. Upsert Budget
	if err := s.repo.Upsert(budget); err != nil {
		return nil, err
	}

	return &dto.BudgetResponse{
		ID:          budget.ID,
		CategoryID:  budget.CategoryID,
		Amount:      budget.Amount,
		PeriodMonth: budget.PeriodMonth,
		PeriodYear:  budget.PeriodYear,
		CreatedAt:   budget.CreatedAt,
		UpdatedAt:   budget.UpdatedAt,
	}, nil
}

func (s *BudgetService) GetBudgets(userID string) ([]dto.BudgetResponse, error) {
	budgets, err := s.repo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	var res []dto.BudgetResponse
	for _, b := range budgets {
		res = append(res, dto.BudgetResponse{
			ID:          b.ID,
			CategoryID:  b.CategoryID,
			Amount:      b.Amount,
			PeriodMonth: b.PeriodMonth,
			PeriodYear:  b.PeriodYear,
			CreatedAt:   b.CreatedAt,
			UpdatedAt:   b.UpdatedAt,
		})
	}

	return res, nil
}
