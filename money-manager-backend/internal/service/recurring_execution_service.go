package service

import (
	"log"
	"money-manager/internal/domain"
	"money-manager/internal/repository"
	"time"

	"gorm.io/gorm"
)

type RecurringExecutionService struct {
	db            *gorm.DB
	repo          *repository.RecurringTransactionRepository
	txRepo        *repository.TransactionRepository
	walletRepo    *repository.WalletRepository
}

func NewRecurringExecutionService(
	db *gorm.DB,
	repo *repository.RecurringTransactionRepository,
	txRepo *repository.TransactionRepository,
	walletRepo *repository.WalletRepository,
) *RecurringExecutionService {
	return &RecurringExecutionService{
		db:         db,
		repo:       repo,
		txRepo:     txRepo,
		walletRepo: walletRepo,
	}
}

func (s *RecurringExecutionService) Start() {
	ticker := time.NewTicker(1 * time.Hour) // Run every hour
	go func() {
		for range ticker.C {
			s.ProcessDueTransactions()
		}
	}()
}

func (s *RecurringExecutionService) ProcessDueTransactions() {
	now := time.Now()
	rts, err := s.repo.GetDueTransactions(now)
	if err != nil {
		log.Printf("Error getting due transactions: %v", err)
		return
	}

	for _, rt := range rts {
		s.execute(rt)
	}
}

func (s *RecurringExecutionService) execute(rt domain.RecurringTransaction) {
	err := s.db.Transaction(func(dbTx *gorm.DB) error {
		txRepo := s.txRepo.WithTx(dbTx)
		walletRepo := s.walletRepo.WithTx(dbTx)
		recurringRepo := s.repo.WithTx(dbTx)

		// 1. Create actual transaction
		newTx := &domain.Transaction{
			UserID:          rt.UserID,
			Type:            rt.Type,
			Amount:          rt.Amount,
			CategoryID:      &rt.CategoryID,
			TransactionDate: time.Now(),
			Note:            &rt.Note,
		}

		if rt.Type == domain.TransactionTypeIncome {
			newTx.DestinationWalletID = &rt.WalletID
		} else {
			newTx.SourceWalletID = &rt.WalletID
		}

		if err := txRepo.Create(newTx); err != nil {
			return err
		}

		// 2. Update Wallet Balance
		balanceChange := rt.Amount
		if rt.Type == domain.TransactionTypeExpense {
			balanceChange = -rt.Amount
		}
		if err := walletRepo.UpdateBalance(rt.WalletID, rt.UserID, balanceChange); err != nil {
			return err
		}

		// 3. Update next_run_date
		rt.NextRunDate = s.calculateNextRunDate(rt.NextRunDate, rt.Frequency)
		rt.UpdatedAt = time.Now()
		if err := recurringRepo.Update(&rt); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		log.Printf("Failed to execute recurring transaction %s: %v", rt.ID, err)
	} else {
		log.Printf("Successfully executed recurring transaction %s", rt.ID)
	}
}

func (s *RecurringExecutionService) calculateNextRunDate(current time.Time, frequency string) time.Time {
	switch frequency {
	case domain.FrequencyDaily:
		return current.AddDate(0, 0, 1)
	case domain.FrequencyWeekly:
		return current.AddDate(0, 0, 7)
	case domain.FrequencyMonthly:
		return current.AddDate(0, 1, 0)
	case domain.FrequencyYearly:
		return current.AddDate(1, 0, 0)
	default:
		return current.AddDate(0, 1, 0)
	}
}
