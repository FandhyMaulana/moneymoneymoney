package main

import (
	"log"
	"time"

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
	transactionRepo := repository.NewTransactionRepository(db)
	budgetRepo := repository.NewBudgetRepository(db)

	// 4. Initialize Service
	authService := service.NewAuthService(userRepo, cfg)
	walletService := service.NewWalletService(walletRepo)
	categoryService := service.NewCategoryService(categoryRepo)
	transactionService := service.NewTransactionService(db, transactionRepo, walletRepo, categoryRepo)
	budgetService := service.NewBudgetService(budgetRepo, categoryRepo)
	dashboardService := service.NewDashboardService(walletRepo, transactionRepo)
	reportService := service.NewReportService(transactionRepo)

	// 5. Initialize Handler
	authHandler := handler.NewAuthHandler(authService)
	walletHandler := handler.NewWalletHandler(walletService)
	categoryHandler := handler.NewCategoryHandler(categoryService)
	transactionHandler := handler.NewTransactionHandler(transactionService)
	budgetHandler := handler.NewBudgetHandler(budgetService)
	dashboardHandler := handler.NewDashboardHandler(dashboardService)
	reportHandler := handler.NewReportHandler(reportService)

	// 6. Setup Router
	r := gin.Default()

	// Health Check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "OK"})
	})

	// Auth Routes
	authGroup := r.Group("/auth")
	authGroup.Use(middleware.RateLimiter(5, 1*time.Minute)) // 5 requests per minute for auth
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

		// Transaction Routes
		api.POST("/transactions", transactionHandler.CreateTransaction)
		api.GET("/transactions", transactionHandler.GetTransactions)
		api.DELETE("/transactions/:id", transactionHandler.DeleteTransaction)

		// Budget Routes
		api.POST("/budgets", budgetHandler.SetBudget)
		api.GET("/budgets", budgetHandler.GetBudgets)
		api.GET("/budgets/summary", budgetHandler.GetBudgetSummary)

		// Dashboard & Report Routes
		api.GET("/dashboard", dashboardHandler.GetSummary)
		api.GET("/reports/monthly", reportHandler.GetMonthlyReport)
	}

	log.Println("Server running on port", cfg.Port)
	r.Run(":" + cfg.Port)
}
