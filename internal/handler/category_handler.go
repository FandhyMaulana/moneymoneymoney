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

type CategoryHandler struct {
	service *service.CategoryService
}

func NewCategoryHandler(service *service.CategoryService) *CategoryHandler {
	return &CategoryHandler{service: service}
}

func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	userID := utils.GetUserID(c)

	var req dto.CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse(err.Error()))
		return
	}

	res, err := h.service.CreateCategory(userID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse("internal server error"))
		return
	}

	c.JSON(http.StatusCreated, dto.SuccessResponse("category created successfully", res))
}

func (h *CategoryHandler) GetCategories(c *gin.Context) {
	userID := utils.GetUserID(c)

	res, err := h.service.GetUserCategories(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse("internal server error"))
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse("categories retrieved successfully", res))
}

func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	userID := utils.GetUserID(c)
	id := c.Param("id")

	if err := h.service.DeleteCategory(id, userID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, dto.ErrorResponse("category not found or cannot be deleted"))
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse("internal server error"))
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse("category deleted successfully", nil))
}
