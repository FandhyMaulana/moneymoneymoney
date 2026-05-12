package dto

type CreateWalletRequest struct {
	Name string `json:"name" binding:"required"`
	Type string `json:"type" binding:"required"` // e.g., "bank", "cash", "e-wallet"
}

type UpdateWalletRequest struct {
	Name     *string `json:"name"`
	Type     *string `json:"type"`
	IsActive *bool   `json:"is_active"`
}

type WalletResponse struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Type      string `json:"type"`
	IsActive  bool   `json:"is_active"`
	CreatedAt string `json:"created_at"`
}
