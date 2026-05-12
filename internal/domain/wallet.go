package domain

import (
	"time"

	"gorm.io/gorm"
)

const (
	WalletTypeBank    = "bank"
	WalletTypeCash    = "cash"
	WalletTypeEWallet = "e-wallet"
)

type Wallet struct {
	ID        string         `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID    string         `gorm:"type:uuid;not null;index" json:"user_id"`
	Name      string         `gorm:"type:varchar(255);not null" json:"name"`
	Type      string         `gorm:"type:varchar(50);not null" json:"type"`
	Balance   float64        `gorm:"type:numeric;default:0;not null" json:"balance"`
	IsActive  bool           `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time      `gorm:"not null" json:"created_at"`
	UpdatedAt *time.Time     `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
