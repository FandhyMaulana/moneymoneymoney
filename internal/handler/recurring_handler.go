package handler

import (
	"money-manager/internal/dto"
	"money-manager/internal/service"
	"money-manager/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type RecurringTransactionHandler struct {
	service *service.RecurringTransactionService
}

func NewRecurringTransactionHandler(service *service.RecurringTransactionService) *RecurringTransactionHandler {
	return &RecurringTransactionHandler{service: service}
}

func (h *RecurringTransactionHandler) Create(c *gin.Context) {
	userID := utils.GetUserID(c)

	var req dto.CreateRecurringTransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse(err.Error()))
		return
	}

	res, err := h.service.Create(userID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse("internal server error"))
		return
	}

	c.JSON(http.StatusCreated, dto.SuccessResponse("recurring transaction created successfully", res))
}

func (h *RecurringTransactionHandler) GetUserRecurringTransactions(c *gin.Context) {
	userID := utils.GetUserID(c)

	var query dto.PaginationQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse(err.Error()))
		return
	}

	res, total, err := h.service.GetUserRecurringTransactions(userID, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse("internal server error"))
		return
	}

	meta := utils.GetPaginationMeta(total, query.Page, query.Limit)
	c.JSON(http.StatusOK, dto.PaginatedResponse("recurring transactions retrieved successfully", res, meta))
}

func (h *RecurringTransactionHandler) Update(c *gin.Context) {
	userID := utils.GetUserID(c)
	id := c.Param("id")

	var req dto.UpdateRecurringTransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse(err.Error()))
		return
	}

	res, err := h.service.Update(id, userID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse("internal server error"))
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse("recurring transaction updated successfully", res))
}

func (h *RecurringTransactionHandler) Delete(c *gin.Context) {
	userID := utils.GetUserID(c)
	id := c.Param("id")

	if err := h.service.Delete(id, userID); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse("internal server error"))
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse("recurring transaction deleted successfully", nil))
}
