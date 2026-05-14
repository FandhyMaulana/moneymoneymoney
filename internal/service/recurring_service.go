package service

import (
	"money-manager/internal/domain"
	"money-manager/internal/dto"
	"money-manager/internal/repository"
	"time"
)

type RecurringTransactionService struct {
	repo         *repository.RecurringTransactionRepository
	walletRepo   *repository.WalletRepository
	categoryRepo *repository.CategoryRepository
}

func NewRecurringTransactionService(
	repo *repository.RecurringTransactionRepository,
	walletRepo *repository.WalletRepository,
	categoryRepo *repository.CategoryRepository,
) *RecurringTransactionService {
	return &RecurringTransactionService{
		repo:         repo,
		walletRepo:   walletRepo,
		categoryRepo: categoryRepo,
	}
}

func (s *RecurringTransactionService) Create(userID string, req dto.CreateRecurringTransactionRequest) (*dto.RecurringTransactionResponse, error) {
	// Validate wallet and category
	if _, err := s.walletRepo.GetByID(req.WalletID, userID); err != nil {
		return nil, err
	}
	if _, err := s.categoryRepo.GetByID(req.CategoryID, userID); err != nil {
		return nil, err
	}

	rt := &domain.RecurringTransaction{
		UserID:      userID,
		WalletID:    req.WalletID,
		CategoryID:  req.CategoryID,
		Type:        req.Type,
		Amount:      req.Amount,
		Note:        req.Note,
		Frequency:   req.Frequency,
		StartDate:   req.StartDate,
		NextRunDate: req.StartDate,
		IsActive:    true,
	}

	if err := s.repo.Create(rt); err != nil {
		return nil, err
	}

	return s.toResponse(rt), nil
}

func (s *RecurringTransactionService) GetUserRecurringTransactions(userID string, query dto.PaginationQuery) ([]dto.RecurringTransactionResponse, int64, error) {
	rts, total, err := s.repo.GetByUserID(userID, query)
	if err != nil {
		return nil, 0, err
	}

	res := make([]dto.RecurringTransactionResponse, 0)
	for _, rt := range rts {
		res = append(res, *s.toResponse(&rt))
	}

	return res, total, nil
}

func (s *RecurringTransactionService) Update(id string, userID string, req dto.UpdateRecurringTransactionRequest) (*dto.RecurringTransactionResponse, error) {
	rt, err := s.repo.GetByID(id, userID)
	if err != nil {
		return nil, err
	}

	if req.WalletID != nil {
		if _, err := s.walletRepo.GetByID(*req.WalletID, userID); err != nil {
			return nil, err
		}
		rt.WalletID = *req.WalletID
	}
	if req.CategoryID != nil {
		if _, err := s.categoryRepo.GetByID(*req.CategoryID, userID); err != nil {
			return nil, err
		}
		rt.CategoryID = *req.CategoryID
	}
	if req.Amount != nil {
		rt.Amount = *req.Amount
	}
	if req.Note != nil {
		rt.Note = *req.Note
	}
	if req.Frequency != nil {
		rt.Frequency = *req.Frequency
	}
	if req.IsActive != nil {
		rt.IsActive = *req.IsActive
	}

	rt.UpdatedAt = time.Now()
	if err := s.repo.Update(rt); err != nil {
		return nil, err
	}

	return s.toResponse(rt), nil
}

func (s *RecurringTransactionService) Delete(id string, userID string) error {
	return s.repo.Delete(id, userID)
}

func (s *RecurringTransactionService) toResponse(rt *domain.RecurringTransaction) *dto.RecurringTransactionResponse {
	return &dto.RecurringTransactionResponse{
		ID:          rt.ID,
		WalletID:    rt.WalletID,
		CategoryID:  rt.CategoryID,
		Type:        rt.Type,
		Amount:      rt.Amount,
		Note:        rt.Note,
		Frequency:   rt.Frequency,
		StartDate:   rt.StartDate,
		NextRunDate: rt.NextRunDate,
		IsActive:    rt.IsActive,
		CreatedAt:   rt.CreatedAt,
	}
}
