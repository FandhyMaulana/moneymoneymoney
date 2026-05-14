package handler

import (
	"errors"
	"money-manager/internal/dto"
	"money-manager/internal/service"
	"money-manager/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TransactionHandler struct {
	service *service.TransactionService
}

func NewTransactionHandler(service *service.TransactionService) *TransactionHandler {
	return &TransactionHandler{service: service}
}

func (h *TransactionHandler) CreateTransaction(c *gin.Context) {
	userID := utils.GetUserID(c)

	var req dto.CreateTransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse(err.Error()))
		return
	}

	res, err := h.service.CreateTransaction(userID, req)
	if err != nil {
		// Specific error mapping for validation
		if err.Error() == "invalid category: not found" || 
		   err.Error() == "invalid destination wallet: not found" || 
		   err.Error() == "invalid source wallet: not found" ||
		   err.Error() == "invalid source or destination wallet: not found" {
			c.JSON(http.StatusNotFound, dto.ErrorResponse(err.Error()))
			return
		}
		c.JSON(http.StatusBadRequest, dto.ErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusCreated, dto.SuccessResponse("transaction created successfully", res))
}

func (h *TransactionHandler) GetTransactions(c *gin.Context) {
	userID := utils.GetUserID(c)

	var query dto.TransactionQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse(err.Error()))
		return
	}

	res, total, err := h.service.GetUserTransactions(userID, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse("internal server error"))
		return
	}

	meta := utils.GetPaginationMeta(total, query.Page, query.Limit)
	c.JSON(http.StatusOK, dto.PaginatedResponse("transactions retrieved successfully", res, meta))
}

func (h *TransactionHandler) DeleteTransaction(c *gin.Context) {
	userID := utils.GetUserID(c)
	id := c.Param("id")

	if err := h.service.DeleteTransaction(id, userID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, dto.ErrorResponse("transaction not found"))
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse("internal server error"))
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse("transaction deleted and wallet balance reverted", nil))
}
