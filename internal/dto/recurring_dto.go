package dto

import "time"

type CreateRecurringTransactionRequest struct {
	WalletID   string    `json:"wallet_id" binding:"required"`
	CategoryID string    `json:"category_id" binding:"required"`
	Type       string    `json:"type" binding:"required,oneof=income expense"`
	Amount     float64   `json:"amount" binding:"required,gt=0"`
	Note       string    `json:"note"`
	Frequency  string    `json:"frequency" binding:"required,oneof=daily weekly monthly yearly"`
	StartDate  time.Time `json:"start_date" binding:"required"`
}

type UpdateRecurringTransactionRequest struct {
	WalletID   *string  `json:"wallet_id"`
	CategoryID *string  `json:"category_id"`
	Amount     *float64 `json:"amount" binding:"omitempty,gt=0"`
	Note       *string  `json:"note"`
	Frequency  *string  `json:"frequency" binding:"omitempty,oneof=daily weekly monthly yearly"`
	IsActive   *bool    `json:"is_active"`
}

type RecurringTransactionResponse struct {
	ID          string    `json:"id"`
	WalletID    string    `json:"wallet_id"`
	CategoryID  string    `json:"category_id"`
	Type        string    `json:"type"`
	Amount      float64   `json:"amount"`
	Note        string    `json:"note"`
	Frequency   string    `json:"frequency"`
	StartDate   time.Time `json:"start_date"`
	NextRunDate time.Time `json:"next_run_date"`
	IsActive    bool      `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
}
