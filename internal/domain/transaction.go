package domain

import (
	"time"

	"gorm.io/gorm"
)

const (
	TransactionTypeIncome   = "income"
	TransactionTypeExpense  = "expense"
	TransactionTypeTransfer = "transfer"
)

type Transaction struct {
	ID                  string         `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID              string         `gorm:"type:uuid;not null;index" json:"user_id"`
	Type                string         `gorm:"type:varchar(50);not null" json:"type"`
	Amount              float64        `gorm:"type:numeric;not null" json:"amount"`
	CategoryID          *string        `gorm:"type:uuid;index" json:"category_id"`
	SourceWalletID      *string        `gorm:"type:uuid;index" json:"source_wallet_id"`
	DestinationWalletID *string        `gorm:"type:uuid;index" json:"destination_wallet_id"`
	ReferenceNo         *string        `gorm:"type:varchar(255)" json:"reference_no"`
	Note                *string        `gorm:"type:text" json:"note"`
	AttachmentURL       *string        `gorm:"type:text" json:"attachment_url"`
	TransactionDate     time.Time      `gorm:"not null" json:"transaction_date"`
	CreatedAt           time.Time      `gorm:"not null" json:"created_at"`
	UpdatedAt           *time.Time     `json:"updated_at"`
	DeletedAt           gorm.DeletedAt `gorm:"index" json:"-"`
}
