package handler

import (
	"money-manager/internal/dto"
	"money-manager/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type BudgetHandler struct {
	service *service.BudgetService
}

func NewBudgetHandler(service *service.BudgetService) *BudgetHandler {
	return &BudgetHandler{service: service}
}

func (h *BudgetHandler) SetBudget(c *gin.Context) {
	userID := c.MustGet("user_id").(string)

	var req dto.UpsertBudgetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse(err.Error()))
		return
	}

	res, err := h.service.SetBudget(userID, req)
	if err != nil {
		if err.Error() == "invalid category" {
			c.JSON(http.StatusNotFound, dto.ErrorResponse(err.Error()))
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse("internal server error"))
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse("budget set successfully", res))
}

func (h *BudgetHandler) GetBudgets(c *gin.Context) {
	userID := c.MustGet("user_id").(string)

	res, err := h.service.GetBudgets(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse("internal server error"))
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse("budgets retrieved successfully", res))
}
