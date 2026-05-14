package service

import (
	"errors"
	"strings"

	"money-manager/internal/config"
	"money-manager/internal/domain"
	"money-manager/internal/dto"
	"money-manager/internal/repository"
	"money-manager/internal/utils"

	"gorm.io/gorm"
)

var (
	ErrEmailExists        = errors.New("email already exists")
	ErrInvalidCredentials = errors.New("invalid credentials")
)

type AuthService struct {
	repo   *repository.UserRepository
	config *config.Config
}

func NewAuthService(repo *repository.UserRepository, cfg *config.Config) *AuthService {
	return &AuthService{
		repo:   repo,
		config: cfg,
	}
}

func (s *AuthService) Register(req dto.RegisterRequest) error {
	existingUser, err := s.repo.GetByEmail(req.Email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	if existingUser != nil {
		return ErrEmailExists
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return err
	}

	user := &domain.User{
		Email:        req.Email,
		PasswordHash: hashedPassword,
		IsActive:     true,
	}

	err = s.repo.Create(user)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value") {
			return ErrEmailExists
		}
		return err
	}

	return nil
}

func (s *AuthService) Login(req dto.LoginRequest) (*dto.AuthResponse, error) {
	user, err := s.repo.GetByEmail(req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}

	if !user.IsActive {
		return nil, ErrInvalidCredentials
	}

	if err := utils.ComparePassword(user.PasswordHash, req.Password); err != nil {
		return nil, ErrInvalidCredentials
	}

	token, err := utils.GenerateToken(user.ID, s.config.JWTSecret)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{Token: token}, nil
}
