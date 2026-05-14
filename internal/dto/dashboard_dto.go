package dto

type DashboardSummaryResponse struct {
	TotalBalance              float64             `json:"total_balance"`
	MonthlyIncome             float64             `json:"monthly_income"`
	MonthlyExpense            float64             `json:"monthly_expense"`
	SavingsRate               float64             `json:"savings_rate"`
	TopExpenseCategory        *CategorySpending   `json:"top_expense_category"`
	WalletCount               int64               `json:"wallet_count"`
	TransactionCountThisMonth int64               `json:"transaction_count_this_month"`
}

type CategorySpending struct {
	ID         string  `json:"id"`
	Name       string  `json:"name"`
	Amount     float64 `json:"amount"`
	Percentage float64 `json:"percentage"`
}
