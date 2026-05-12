package handler

import (
	"errors"
	"money-manager/internal/dto"
	"money-manager/internal/service"
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
	userID := c.MustGet("user_id").(string)

	var req dto.CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := h.service.CreateCategory(userID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusCreated, res)
}

func (h *CategoryHandler) GetCategories(c *gin.Context) {
	userID := c.MustGet("user_id").(string)

	res, err := h.service.GetUserCategories(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	userID := c.MustGet("user_id").(string)
	id := c.Param("id")

	if err := h.service.DeleteCategory(id, userID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "category not found or cannot be deleted"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "category deleted successfully"})
}
