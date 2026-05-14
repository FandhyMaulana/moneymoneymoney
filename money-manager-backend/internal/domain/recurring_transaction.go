package domain

import (
	"time"

	"gorm.io/gorm"
)

const (
	FrequencyDaily   = "daily"
	FrequencyWeekly  = "weekly"
	FrequencyMonthly = "monthly"
	FrequencyYearly  = "yearly"
)

type RecurringTransaction struct {
	ID          string         `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID      string         `gorm:"type:uuid;not null;index" json:"user_id"`
	WalletID    string         `gorm:"type:uuid;not null;index" json:"wallet_id"`
	CategoryID  string         `gorm:"type:uuid;not null;index" json:"category_id"`
	Type        string         `gorm:"type:varchar(50);not null" json:"type"` // income/expense
	Amount      float64        `gorm:"type:numeric;not null" json:"amount"`
	Note        string         `gorm:"type:text" json:"note"`
	Frequency   string         `gorm:"type:varchar(50);not null" json:"frequency"` // daily, weekly, monthly, yearly
	StartDate   time.Time      `gorm:"not null" json:"start_date"`
	NextRunDate time.Time      `gorm:"not null;index" json:"next_run_date"`
	IsActive    bool           `gorm:"default:true" json:"is_active"`
	CreatedAt   time.Time      `gorm:"not null" json:"created_at"`
	UpdatedAt   time.Time      `gorm:"not null" json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
