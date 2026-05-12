package handler

import (
	"money-manager/internal/dto"
	"money-manager/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create category"})
		return
	}

	c.JSON(http.StatusCreated, res)
}

func (h *CategoryHandler) GetCategories(c *gin.Context) {
	userID := c.MustGet("user_id").(string)

	res, err := h.service.GetUserCategories(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get categories"})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	userID := c.MustGet("user_id").(string)
	id := c.Param("id")

	if err := h.service.DeleteCategory(id, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "category deleted successfully"})
}
