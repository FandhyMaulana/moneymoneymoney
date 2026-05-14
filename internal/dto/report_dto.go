package dto

type MonthlyReportResponse struct {
	Month      int                `json:"month"`
	Year       int                `json:"year"`
	Income     float64            `json:"income"`
	Expense    float64            `json:"expense"`
	Savings    float64            `json:"savings"`
	Categories []CategorySpending `json:"categories"`
}
