package main

import (
	"log"

	"money-manager/internal/config"
	"money-manager/internal/database"
	"money-manager/internal/handler"
	"money-manager/internal/middleware"
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
	walletRepo := repository.NewWalletRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)

	// 4. Initialize Service
	authService := service.NewAuthService(userRepo, cfg)
	walletService := service.NewWalletService(walletRepo)
	categoryService := service.NewCategoryService(categoryRepo)

	// 5. Initialize Handler
	authHandler := handler.NewAuthHandler(authService)
	walletHandler := handler.NewWalletHandler(walletService)
	categoryHandler := handler.NewCategoryHandler(categoryService)

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

	// Protected Routes
	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware(cfg.JWTSecret))
	{
		api.GET("/me", func(c *gin.Context) {
			userID := c.MustGet("user_id").(string)
			c.JSON(200, gin.H{"user_id": userID})
		})

		// Wallet Routes
		api.POST("/wallets", walletHandler.CreateWallet)
		api.GET("/wallets", walletHandler.GetWallets)
		api.DELETE("/wallets/:id", walletHandler.DeleteWallet)

		// Category Routes
		api.POST("/categories", categoryHandler.CreateCategory)
		api.GET("/categories", categoryHandler.GetCategories)
		api.DELETE("/categories/:id", categoryHandler.DeleteCategory)
	}



	log.Println("Server running on port", cfg.Port)
	r.Run(":" + cfg.Port)
}

