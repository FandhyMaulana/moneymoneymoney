package service

import (
	"math"
	"money-manager/internal/dto"
	"money-manager/internal/repository"
	"time"
)

type ReportService struct {
	transactionRepo *repository.TransactionRepository
}

func NewReportService(tRepo *repository.TransactionRepository) *ReportService {
	return &ReportService{transactionRepo: tRepo}
}

func (s *ReportService) GetMonthlyReport(userID string, month, year int) (*dto.MonthlyReportResponse, error) {
	if month == 0 || year == 0 {
		now := time.Now()
		month = int(now.Month())
		year = now.Year()
	}

	income, expense, err := s.transactionRepo.GetMonthlyTotals(userID, month, year)
	if err != nil {
		return nil, err
	}

	categories, err := s.transactionRepo.GetCategoryBreakdown(userID, month, year)
	if err != nil {
		return nil, err
	}

	// Calculate percentages for categories
	for i := range categories {
		if expense > 0 {
			categories[i].Percentage = math.Round((categories[i].Amount/expense)*10000) / 100
		}
	}

	return &dto.MonthlyReportResponse{
		Month:      month,
		Year:       year,
		Income:     income,
		Expense:    expense,
		Savings:    income - expense,
		Categories: categories,
	}, nil
}
