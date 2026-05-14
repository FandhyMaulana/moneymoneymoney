package dto

type JSONResponse struct {
	Success    bool            `json:"success"`
	Message    string          `json:"message,omitempty"`
	Data       interface{}     `json:"data,omitempty"`
	Error      string          `json:"error,omitempty"`
	Pagination *PaginationMeta `json:"pagination,omitempty"`
}

type PaginationMeta struct {
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"total_pages"`
}

func SuccessResponse(message string, data interface{}) JSONResponse {
	return JSONResponse{
		Success: true,
		Message: message,
		Data:    data,
	}
}

func PaginatedResponse(message string, data interface{}, meta PaginationMeta) JSONResponse {
	return JSONResponse{
		Success:    true,
		Message:    message,
		Data:       data,
		Pagination: &meta,
	}
}

func ErrorResponse(err string) JSONResponse {
	return JSONResponse{
		Success: false,
		Error:   err,
	}
}
