package handler

import (
	"money-manager/internal/dto"
	"money-manager/internal/service"
	"money-manager/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ReportHandler struct {
	service *service.ReportService
}

func NewReportHandler(service *service.ReportService) *ReportHandler {
	return &ReportHandler{service: service}
}

func (h *ReportHandler) GetMonthlyReport(c *gin.Context) {
	userID := utils.GetUserID(c)

	month, _ := strconv.Atoi(c.Query("month"))
	year, _ := strconv.Atoi(c.Query("year"))

	res, err := h.service.GetMonthlyReport(userID, month, year)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse("internal server error"))
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse("monthly report retrieved successfully", res))
}
