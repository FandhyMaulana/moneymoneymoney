package main

import (
	"log"

	"money-manager/internal/config"
	"money-manager/internal/database"
	"money-manager/internal/handler"
	"money-manager/internal/repository"
	"money-manager/internal/service"

	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Load Config
	cfg := config.LoadConfig()

	// 2. Connect & Migrate DB
	db := database.Connect(cfg.DB_DSN)
	database.Migrate(db)

	// 3. Initialize Repository
	userRepo := repository.NewUserRepository(db)

	// 4. Initialize Service
	authService := service.NewAuthService(userRepo, cfg)

	// 5. Initialize Handler
	authHandler := handler.NewAuthHandler(authService)

	// 6. Setup Router
	r := gin.Default()

	// Health Check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "OK"})
	})

	// Auth Routes
	authGroup := r.Group("/auth")
	{
		authGroup.POST("/register", authHandler.Register)
		authGroup.POST("/login", authHandler.Login)
	}

	log.Println("Server running on port", cfg.Port)
	r.Run(":" + cfg.Port)
}
