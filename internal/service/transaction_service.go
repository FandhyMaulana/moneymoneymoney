package service

import (
	"errors"
	"money-manager/internal/domain"
	"money-manager/internal/dto"
	"money-manager/internal/repository"
)

type TransactionService struct {
	repo         *repository.TransactionRepository
	walletRepo   *repository.WalletRepository
	categoryRepo *repository.CategoryRepository
}

func NewTransactionService(
	repo *repository.TransactionRepository,
	walletRepo *repository.WalletRepository,
	categoryRepo *repository.CategoryRepository,
) *TransactionService {
	return &TransactionService{
		repo:         repo,
		walletRepo:   walletRepo,
		categoryRepo: categoryRepo,
	}
}

func (s *TransactionService) CreateTransaction(userID string, req dto.CreateTransactionRequest) (*dto.TransactionResponse, error) {
	// 1. Validate Category if provided
	if req.CategoryID != nil {
		_, err := s.categoryRepo.GetByID(*req.CategoryID, userID)
		if err != nil {
			return nil, errors.New("invalid category")
		}
	}

	// 2. Validate Wallets based on Type
	switch req.Type {
	case "income":
		if req.DestinationWalletID == nil {
			return nil, errors.New("destination wallet is required for income")
		}
		_, err := s.walletRepo.GetByID(*req.DestinationWalletID, userID)
		if err != nil {
			return nil, errors.New("invalid destination wallet")
		}
	case "expense":
		if req.SourceWalletID == nil {
			return nil, errors.New("source wallet is required for expense")
		}
		_, err := s.walletRepo.GetByID(*req.SourceWalletID, userID)
		if err != nil {
			return nil, errors.New("invalid source wallet")
		}
	case "transfer":
		if req.SourceWalletID == nil || req.DestinationWalletID == nil {
			return nil, errors.New("both source and destination wallets are required for transfer")
		}
		if *req.SourceWalletID == *req.DestinationWalletID {
			return nil, errors.New("source and destination wallets must be different")
		}
		_, errS := s.walletRepo.GetByID(*req.SourceWalletID, userID)
		_, errD := s.walletRepo.GetByID(*req.DestinationWalletID, userID)
		if errS != nil || errD != nil {
			return nil, errors.New("invalid source or destination wallet")
		}
	}

	// 3. Create Transaction record
	tx := &domain.Transaction{
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

	if err := s.repo.Create(tx); err != nil {
		return nil, err
	}

	return &dto.TransactionResponse{
		ID:                  tx.ID,
		Type:                tx.Type,
		Amount:              tx.Amount,
		CategoryID:          tx.CategoryID,
		SourceWalletID:      tx.SourceWalletID,
		DestinationWalletID: tx.DestinationWalletID,
		ReferenceNo:         tx.ReferenceNo,
		Note:                tx.Note,
		AttachmentURL:       tx.AttachmentURL,
		TransactionDate:     tx.TransactionDate,
		CreatedAt:           tx.CreatedAt,
	}, nil
}

func (s *TransactionService) GetUserTransactions(userID string) ([]dto.TransactionResponse, error) {
	txs, err := s.repo.GetByUserID(userID)
	if err != nil {
		return nil, err
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

	return res, nil
}
