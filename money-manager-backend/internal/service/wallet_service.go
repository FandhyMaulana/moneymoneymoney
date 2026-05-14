package service

import (
	"money-manager/internal/domain"
	"money-manager/internal/dto"
	"money-manager/internal/repository"
)

type WalletService struct {
	repo *repository.WalletRepository
}

func NewWalletService(repo *repository.WalletRepository) *WalletService {
	return &WalletService{repo: repo}
}

func (s *WalletService) CreateWallet(userID string, req dto.CreateWalletRequest) (*dto.WalletResponse, error) {
	wallet := &domain.Wallet{
		UserID:   userID,
		Name:     req.Name,
		Type:     req.Type,
		Balance:  req.InitialBalance,
		IsActive: true,
	}

	if err := s.repo.Create(wallet); err != nil {
		return nil, err
	}

	return &dto.WalletResponse{
		ID:        wallet.ID,
		Name:      wallet.Name,
		Type:      wallet.Type,
		Balance:   wallet.Balance,
		IsActive:  wallet.IsActive,
		CreatedAt: wallet.CreatedAt.Format("2006-01-02 15:04:05"),
	}, nil
}

func (s *WalletService) GetUserWallets(userID string, query dto.PaginationQuery) ([]dto.WalletResponse, int64, error) {
	wallets, total, err := s.repo.GetByUserID(userID, query)
	if err != nil {
		return nil, 0, err
	}

	var res []dto.WalletResponse
	for _, w := range wallets {
		res = append(res, dto.WalletResponse{
			ID:        w.ID,
			Name:      w.Name,
			Type:      w.Type,
			Balance:   w.Balance,
			IsActive:  w.IsActive,
			CreatedAt: w.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	return res, total, nil
}

func (s *WalletService) DeleteWallet(id string, userID string) error {
	return s.repo.Delete(id, userID)
}
