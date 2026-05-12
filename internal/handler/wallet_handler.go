package handler

import (
	"errors"
	"money-manager/internal/dto"
	"money-manager/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type WalletHandler struct {
	service *service.WalletService
}

func NewWalletHandler(service *service.WalletService) *WalletHandler {
	return &WalletHandler{service: service}
}

func (h *WalletHandler) CreateWallet(c *gin.Context) {
	userID := c.MustGet("user_id").(string)

	var req dto.CreateWalletRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse(err.Error()))
		return
	}

	res, err := h.service.CreateWallet(userID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse("internal server error"))
		return
	}

	c.JSON(http.StatusCreated, dto.SuccessResponse("wallet created successfully", res))
}

func (h *WalletHandler) GetWallets(c *gin.Context) {
	userID := c.MustGet("user_id").(string)

	res, err := h.service.GetUserWallets(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse("internal server error"))
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse("wallets retrieved successfully", res))
}

func (h *WalletHandler) DeleteWallet(c *gin.Context) {
	userID := c.MustGet("user_id").(string)
	walletID := c.Param("id")

	if err := h.service.DeleteWallet(walletID, userID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, dto.ErrorResponse("wallet not found"))
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse("internal server error"))
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse("wallet deleted successfully", nil))
}
