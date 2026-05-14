package handler

import (
	"money-manager/internal/dto"
	"money-manager/internal/service"
	"money-manager/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type DashboardHandler struct {
	service *service.DashboardService
}

func NewDashboardHandler(service *service.DashboardService) *DashboardHandler {
	return &DashboardHandler{service: service}
}

func (h *DashboardHandler) GetSummary(c *gin.Context) {
	userID := utils.GetUserID(c)

	res, err := h.service.GetSummary(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse("internal server error"))
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse("dashboard summary retrieved successfully", res))
}
