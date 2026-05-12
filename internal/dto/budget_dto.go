package dto

import "time"

type UpsertBudgetRequest struct {
	CategoryID  string  `json:"category_id" binding:"required"`
	Amount      float64 `json:"amount" binding:"required,gt=0"`
	PeriodMonth int     `json:"period_month" binding:"required,min=1,max=12"`
	PeriodYear  int     `json:"period_year" binding:"required,min=2000"`
}

type BudgetResponse struct {
	ID          string     `json:"id"`
	CategoryID  string     `json:"category_id"`
	Amount      float64    `json:"amount"`
	PeriodMonth int        `json:"period_month"`
	PeriodYear  int        `json:"period_year"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at"`
}
