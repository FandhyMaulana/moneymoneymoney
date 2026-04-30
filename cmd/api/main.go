package main

import (
	"log"

	"money-manager/internal/config"
	"money-manager/internal/database"
	"money-manager/internal/domain"

	"github.com/gin-gonic/gin"
)

func main() {
	// load config
	cfg := config.LoadConfig()

	// connect DB
	db := database.Connect(cfg.DB_DSN)

	err := db.AutoMigrate(
		&domain.User{},
		&domain.Wallet{},
		&domain.Category{},
		&domain.Transaction{},
		&domain.Budget{},
	)

	if err != nil {
		log.Fatal("failed to migrate:", err)
	}

	log.Println("Database migrated")

	// init server
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "OK"})
	})

	log.Println("Server running on port", cfg.Port)
	r.Run(":" + cfg.Port)
}