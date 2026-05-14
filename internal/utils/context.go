package utils

import (
	"github.com/gin-gonic/gin"
)

const UserIDKey = "user_id"

// GetUserID retrieves the user ID from the gin context.
// It assumes the user ID has been set by the AuthMiddleware.
func GetUserID(c *gin.Context) string {
	userID, exists := c.Get(UserIDKey)
	if !exists {
		return ""
	}

	id, ok := userID.(string)
	if !ok {
		return ""
	}

	return id
}
