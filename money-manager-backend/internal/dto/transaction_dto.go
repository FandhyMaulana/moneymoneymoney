package dto

import "time"

type CreateTransactionRequest struct {
	Type                string    `json:"type" binding:"required,oneof=income expense transfer"`
	Amount              float64   `json:"amount" binding:"required,gt=0"`
	CategoryID          *string   `json:"category_id"`
	SourceWalletID      *string   `json:"source_wallet_id"`
	DestinationWalletID *string   `json:"destination_wallet_id"`
	ReferenceNo         *string   `json:"reference_no"`
	Note                *string   `json:"note"`
	AttachmentURL       *string   `json:"attachment_url"`
	TransactionDate     time.Time `json:"transaction_date" binding:"required"`
}

type TransactionResponse struct {
	ID                  string    `json:"id"`
	Type                string    `json:"type"`
	Amount              float64   `json:"amount"`
	CategoryID          *string   `json:"category_id"`
	SourceWalletID      *string   `json:"source_wallet_id"`
	DestinationWalletID *string   `json:"destination_wallet_id"`
	ReferenceNo         *string   `json:"reference_no"`
	Note                *string   `json:"note"`
	AttachmentURL       *string   `json:"attachment_url"`
	TransactionDate     time.Time `json:"transaction_date"`
	CreatedAt           time.Time `json:"created_at"`
}

type TransactionQuery struct {
	Page                int        `form:"page,default=1"`
	Limit               int        `form:"limit,default=20"`
	Search              string     `form:"search"` // note search
	Type                *string    `form:"type" binding:"omitempty,oneof=income expense transfer"`
	CategoryID          *string    `form:"category_id"`
	WalletID            *string    `form:"wallet_id"`
	MinAmount           *float64   `form:"min_amount"`
	MaxAmount           *float64   `form:"max_amount"`
	Month               *int       `form:"month" binding:"omitempty,min=1,max=12"`
	Year                *int       `form:"year" binding:"omitempty,min=1900"`
	StartDate           *time.Time `form:"start_date" time_format:"2006-01-02"`
	EndDate             *time.Time `form:"end_date" time_format:"2006-01-02"`
	Sort                string     `form:"sort,default=newest"` // newest, oldest, highest, lowest
}

