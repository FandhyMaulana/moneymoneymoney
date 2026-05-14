package dto

type CreateWalletRequest struct {
	Name           string  `json:"name" binding:"required"`
	Type           string  `json:"type" binding:"required"` // e.g., "bank", "cash", "e-wallet"
	InitialBalance float64 `json:"initial_balance" binding:"min=0"`
}

type UpdateWalletRequest struct {
	Name     *string `json:"name"`
	Type     *string `json:"type"`
	IsActive *bool   `json:"is_active"`
}

type WalletResponse struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	Type      string  `json:"type"`
	Balance   float64 `json:"balance"`
	IsActive  bool    `json:"is_active"`
	CreatedAt string  `json:"created_at"`
}
