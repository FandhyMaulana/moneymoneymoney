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
