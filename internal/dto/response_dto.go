package dto

type JSONResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func SuccessResponse(message string, data interface{}) JSONResponse {
	return JSONResponse{
		Success: true,
		Message: message,
		Data:    data,
	}
}

func ErrorResponse(err string) JSONResponse {
	return JSONResponse{
		Success: false,
		Error:   err,
	}
}
