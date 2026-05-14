package dto

type UpsertBudgetRequest struct {
	CategoryID  string  `json:"category_id" binding:"required"`
	Amount      float64 `json:"amount" binding:"required,gt=0"`
	PeriodMonth int     `json:"period_month" binding:"required,min=1,max=12"`
	PeriodYear  int     `json:"period_year" binding:"required,min=2000"`
}

type BudgetResponse struct {
	ID          string  `json:"id"`
	CategoryID  string  `json:"category_id"`
	Amount      float64 `json:"amount"`
	PeriodMonth int     `json:"period_month"`
	PeriodYear  int     `json:"period_year"`
}

type BudgetDetailResponse struct {
	ID           string  `json:"id"`
	CategoryID   string  `json:"category_id"`
	CategoryName string  `json:"category_name"`
	BudgetLimit  float64 `json:"budget_limit"`
	Spent        float64 `json:"spent"`
	Remaining    float64 `json:"remaining"`
	Percentage   float64 `json:"percentage"`
	Status       string  `json:"status"` // safe, warning, exceeded
}

type BudgetSummaryResponse struct {
	Month   int                    `json:"month"`
	Year    int                    `json:"year"`
	Budgets []BudgetDetailResponse `json:"budgets"`
}
