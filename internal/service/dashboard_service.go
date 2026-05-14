package service

import (
	"math"
	"money-manager/internal/dto"
	"money-manager/internal/repository"
	"time"
)

type DashboardService struct {
	walletRepo      *repository.WalletRepository
	transactionRepo *repository.TransactionRepository
}

func NewDashboardService(wRepo *repository.WalletRepository, tRepo *repository.TransactionRepository) *DashboardService {
	return &DashboardService{
		walletRepo:      wRepo,
		transactionRepo: tRepo,
	}
}

func (s *DashboardService) GetSummary(userID string) (*dto.DashboardSummaryResponse, error) {
	now := time.Now()
	month := int(now.Month())
	year := now.Year()

	totalBalance, err := s.walletRepo.GetTotalBalance(userID)
	if err != nil {
		return nil, err
	}

	income, expense, err := s.transactionRepo.GetMonthlyTotals(userID, month, year)
	if err != nil {
		return nil, err
	}

	topCategory, err := s.transactionRepo.GetTopExpenseCategory(userID, month, year)
	if err != nil {
		return nil, err
	}

	walletCount, err := s.walletRepo.GetWalletCount(userID)
	if err != nil {
		return nil, err
	}

	txCount, err := s.transactionRepo.GetMonthlyTransactionCount(userID, month, year)
	if err != nil {
		return nil, err
	}

	savingsRate := 0.0
	if income > 0 {
		savingsRate = ((income - expense) / income) * 100
		if savingsRate < 0 {
			savingsRate = 0
		}
	}

	// Calculate percentage for top category if it exists
	if topCategory != nil && expense > 0 {
		topCategory.Percentage = (topCategory.Amount / expense) * 100
	}

	return &dto.DashboardSummaryResponse{
		TotalBalance:              totalBalance,
		MonthlyIncome:             income,
		MonthlyExpense:            expense,
		SavingsRate:               math.Round(savingsRate*100) / 100,
		TopExpenseCategory:        topCategory,
		WalletCount:               walletCount,
		TransactionCountThisMonth: txCount,
	}, nil
}
