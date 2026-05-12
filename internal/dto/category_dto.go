package dto

type CreateCategoryRequest struct {
	Name     string  `json:"name" binding:"required"`
	ParentID *string `json:"parent_id"`
}

type CategoryResponse struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	ParentID  *string `json:"parent_id"`
	IsSystem  bool    `json:"is_system"`
	CreatedAt string  `json:"created_at"`
}
