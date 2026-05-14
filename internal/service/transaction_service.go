package service

import (
	"encoding/csv"
	"errors"
	"fmt"
	"io"
	"money-manager/internal/domain"
	"money-manager/internal/dto"
	"money-manager/internal/repository"

	"gorm.io/gorm"
)

type TransactionService struct {
	db           *gorm.DB
	repo         *repository.TransactionRepository
	walletRepo   *repository.WalletRepository
	categoryRepo *repository.CategoryRepository
}

func NewTransactionService(
	db *gorm.DB,
	repo *repository.TransactionRepository,
	walletRepo *repository.WalletRepository,
	categoryRepo *repository.CategoryRepository,
) *TransactionService {
	return &TransactionService{
		db:           db,
		repo:         repo,
		walletRepo:   walletRepo,
		categoryRepo: categoryRepo,
	}
}

func (s *TransactionService) ExportTransactionsToCSV(userID string, query dto.TransactionQuery, w io.Writer) error {
	// Ensure limit is 0 for export
	query.Limit = 0
	txs, _, err := s.repo.GetByUserID(userID, query)
	if err != nil {
		return err
	}

	writer := csv.NewWriter(w)
	defer writer.Flush()

	// Header
	header := []string{"Date", "Type", "Wallet", "Category", "Amount", "Note"}
	if err := writer.Write(header); err != nil {
		return err
	}

	// Data
	for _, t := range txs {
		walletName := "N/A"
		if t.SourceWalletID != nil {
			walletName = *t.SourceWalletID
		} else if t.DestinationWalletID != nil {
			walletName = *t.DestinationWalletID
		}

		categoryName := "N/A"
		if t.CategoryID != nil {
			categoryName = *t.CategoryID
		}

		row := []string{
			t.TransactionDate.Format("2006-01-02 15:04:05"),
			t.Type,
			walletName,
			categoryName,
			fmt.Sprintf("%.2f", t.Amount),
			" ",
		}
		if t.Note != nil {
			row[5] = *t.Note
		}

		if err := writer.Write(row); err != nil {
			return err
		}
	}

	return nil
}

func (s *TransactionService) CreateTransaction(userID string, req dto.CreateTransactionRequest) (*dto.TransactionResponse, error) {
	// 1. Validate Category if provided
	if req.CategoryID != nil {
		_, err := s.categoryRepo.GetByID(*req.CategoryID, userID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, errors.New("invalid category: not found")
			}
			return nil, err
		}
	}

	// 2. Validate Wallets based on Type
	switch req.Type {
	case domain.TransactionTypeIncome:
		if req.DestinationWalletID == nil {
			return nil, errors.New("destination wallet is required for income")
		}
		_, err := s.walletRepo.GetByID(*req.DestinationWalletID, userID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, errors.New("invalid destination wallet: not found")
			}
			return nil, err
		}
	case domain.TransactionTypeExpense:
		if req.SourceWalletID == nil {
			return nil, errors.New("source wallet is required for expense")
		}
		_, err := s.walletRepo.GetByID(*req.SourceWalletID, userID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, errors.New("invalid source wallet: not found")
			}
			return nil, err
		}
	case domain.TransactionTypeTransfer:
		if req.SourceWalletID == nil || req.DestinationWalletID == nil {
			return nil, errors.New("both source and destination wallets are required for transfer")
		}
		if *req.SourceWalletID == *req.DestinationWalletID {
			return nil, errors.New("source and destination wallets must be different")
		}
		_, errS := s.walletRepo.GetByID(*req.SourceWalletID, userID)
		_, errD := s.walletRepo.GetByID(*req.DestinationWalletID, userID)
		if errS != nil || errD != nil {
			return nil, errors.New("invalid source or destination wallet: not found")
		}
	}

	// 3. Create Transaction and Update Wallet Balance with atomicity
	var txResponse *dto.TransactionResponse
	err := s.db.Transaction(func(dbTx *gorm.DB) error {
		txRepo := s.repo.WithTx(dbTx)
		txWalletRepo := s.walletRepo.WithTx(dbTx)

		newTx := &domain.Transaction{
			UserID:              userID,
			Type:                req.Type,
			Amount:              req.Amount,
			CategoryID:          req.CategoryID,
			SourceWalletID:      req.SourceWalletID,
			DestinationWalletID: req.DestinationWalletID,
			ReferenceNo:         req.ReferenceNo,
			Note:                req.Note,
			AttachmentURL:       req.AttachmentURL,
			TransactionDate:     req.TransactionDate,
		}

		if err := txRepo.Create(newTx); err != nil {
			return err
		}

		// Update Wallet Balance based on Type
		switch req.Type {
		case domain.TransactionTypeIncome:
			if err := txWalletRepo.UpdateBalance(*req.DestinationWalletID, userID, req.Amount); err != nil {
				return err
			}
		case domain.TransactionTypeExpense:
			if err := txWalletRepo.UpdateBalance(*req.SourceWalletID, userID, -req.Amount); err != nil {
				return err
			}
		case domain.TransactionTypeTransfer:
			if err := txWalletRepo.UpdateBalance(*req.SourceWalletID, userID, -req.Amount); err != nil {
				return err
			}
			if err := txWalletRepo.UpdateBalance(*req.DestinationWalletID, userID, req.Amount); err != nil {
				return err
			}
		}

		txResponse = &dto.TransactionResponse{
			ID:                  newTx.ID,
			Type:                newTx.Type,
			Amount:              newTx.Amount,
			CategoryID:          newTx.CategoryID,
			SourceWalletID:      newTx.SourceWalletID,
			DestinationWalletID: newTx.DestinationWalletID,
			ReferenceNo:         newTx.ReferenceNo,
			Note:                newTx.Note,
			AttachmentURL:       newTx.AttachmentURL,
			TransactionDate:     newTx.TransactionDate,
			CreatedAt:           newTx.CreatedAt,
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return txResponse, nil
}

func (s *TransactionService) GetUserTransactions(userID string, query dto.TransactionQuery) ([]dto.TransactionResponse, int64, error) {
	txs, total, err := s.repo.GetByUserID(userID, query)
	if err != nil {
		return nil, 0, err
	}

	var res []dto.TransactionResponse
	for _, t := range txs {
		res = append(res, dto.TransactionResponse{
			ID:                  t.ID,
			Type:                t.Type,
			Amount:              t.Amount,
			CategoryID:          t.CategoryID,
			SourceWalletID:      t.SourceWalletID,
			DestinationWalletID: t.DestinationWalletID,
			ReferenceNo:         t.ReferenceNo,
			Note:                t.Note,
			AttachmentURL:       t.AttachmentURL,
			TransactionDate:     t.TransactionDate,
			CreatedAt:           t.CreatedAt,
		})
	}

	return res, total, nil
}

func (s *TransactionService) DeleteTransaction(id string, userID string) error {
	return s.db.Transaction(func(dbTx *gorm.DB) error {
		txRepo := s.repo.WithTx(dbTx)
		txWalletRepo := s.walletRepo.WithTx(dbTx)

		// 1. Get the transaction to know what to revert
		tx, err := txRepo.GetByID(id, userID)
		if err != nil {
			return err
		}

		// 2. Revert Wallet Balance
		switch tx.Type {
		case domain.TransactionTypeIncome:
			if tx.DestinationWalletID != nil {
				if err := txWalletRepo.UpdateBalance(*tx.DestinationWalletID, userID, -tx.Amount); err != nil {
					return err
				}
			}
		case domain.TransactionTypeExpense:
			if tx.SourceWalletID != nil {
				if err := txWalletRepo.UpdateBalance(*tx.SourceWalletID, userID, tx.Amount); err != nil {
					return err
				}
			}
		case domain.TransactionTypeTransfer:
			if tx.SourceWalletID != nil && tx.DestinationWalletID != nil {
				if err := txWalletRepo.UpdateBalance(*tx.SourceWalletID, userID, tx.Amount); err != nil {
					return err
				}
				if err := txWalletRepo.UpdateBalance(*tx.DestinationWalletID, userID, -tx.Amount); err != nil {
					return err
				}
			}
		}

		// 3. Delete the transaction record
		return txRepo.Delete(id, userID)
	})
}
