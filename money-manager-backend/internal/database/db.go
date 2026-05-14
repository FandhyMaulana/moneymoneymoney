package database

import (
	"log"
	"money-manager/internal/domain"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect(dsn string) *gorm.DB {
	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true, // Disables implicit prepared statement usage
	}), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("failed to get sql.DB:", err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("Database connected")
	return db
}

func Migrate(db *gorm.DB) {
	err := db.AutoMigrate(
		&domain.User{},
		&domain.Wallet{},
		&domain.Category{},
		&domain.Transaction{},
		&domain.Budget{},
		&domain.RecurringTransaction{},
	)
	if err != nil {
		log.Fatal("failed to migrate database:", err)
	}

	log.Println("Database migrated")
}
