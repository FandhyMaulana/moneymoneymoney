package service

import (
	"math"
	"money-manager/internal/domain"
	"money-manager/internal/dto"
	"money-manager/internal/repository"
	"time"
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
		return nil, err
	}

	budget := &domain.Budget{
		UserID:      userID,
		CategoryID:  req.CategoryID,
		Amount:      req.Amount,
		PeriodMonth: req.PeriodMonth,
		PeriodYear:  req.PeriodYear,
	}

	if err := s.repo.Upsert(budget); err != nil {
		return nil, err
	}

	return &dto.BudgetResponse{
		ID:          budget.ID,
		CategoryID:  budget.CategoryID,
		Amount:      budget.Amount,
		PeriodMonth: budget.PeriodMonth,
		PeriodYear:  budget.PeriodYear,
	}, nil
}

func (s *BudgetService) GetBudgetSummary(userID string, month, year int) (*dto.BudgetSummaryResponse, error) {
	if month == 0 || year == 0 {
		now := time.Now()
		month = int(now.Month())
		year = now.Year()
	}

	budgets, err := s.repo.GetBudgetsWithSpending(userID, month, year)
	if err != nil {
		return nil, err
	}

	for i := range budgets {
		b := &budgets[i]
		b.Remaining = b.BudgetLimit - b.Spent
		if b.BudgetLimit > 0 {
			b.Percentage = math.Round((b.Spent/b.BudgetLimit)*10000) / 100
		}

		// Status rules: safe (< 80%), warning (80-99%), exceeded (>=100%)
		if b.Percentage >= 100 {
			b.Status = "exceeded"
		} else if b.Percentage >= 80 {
			b.Status = "warning"
		} else {
			b.Status = "safe"
		}
	}

	return &dto.BudgetSummaryResponse{
		Month:   month,
		Year:    year,
		Budgets: budgets,
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
		})
	}

	return res, nil
}
