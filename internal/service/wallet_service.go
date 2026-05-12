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
		IsActive: true,
	}

	if err := s.repo.Create(wallet); err != nil {
		return nil, err
	}

	return &dto.WalletResponse{
		ID:        wallet.ID,
		Name:      wallet.Name,
		Type:      wallet.Type,
		IsActive:  wallet.IsActive,
		CreatedAt: wallet.CreatedAt.Format("2006-01-02 15:04:05"),
	}, nil
}

func (s *WalletService) GetUserWallets(userID string) ([]dto.WalletResponse, error) {
	wallets, err := s.repo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	var res []dto.WalletResponse
	for _, w := range wallets {
		res = append(res, dto.WalletResponse{
			ID:        w.ID,
			Name:      w.Name,
			Type:      w.Type,
			IsActive:  w.IsActive,
			CreatedAt: w.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	return res, nil
}

func (s *WalletService) DeleteWallet(id string, userID string) error {
	return s.repo.Delete(id, userID)
}
