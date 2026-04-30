package domain

import (
	"time"
)

type Budget struct {
	ID          string     `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID      string     `gorm:"type:uuid;not null;uniqueIndex:idx_budget_user_category_period" json:"user_id"`
	CategoryID  string     `gorm:"type:uuid;not null;uniqueIndex:idx_budget_user_category_period" json:"category_id"`
	Amount      int64      `gorm:"not null" json:"amount"`
	PeriodMonth int        `gorm:"not null;uniqueIndex:idx_budget_user_category_period" json:"period_month"`
	PeriodYear  int        `gorm:"not null;uniqueIndex:idx_budget_user_category_period" json:"period_year"`
	CreatedAt   time.Time  `gorm:"not null" json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at"`
}
