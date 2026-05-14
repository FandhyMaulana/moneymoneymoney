package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port      string
	DB_DSN    string
	JWTSecret string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	cfg := &Config{
		Port:      os.Getenv("PORT"),
		DB_DSN:    os.Getenv("DB_DSN"),
		JWTSecret: os.Getenv("JWT_SECRET"),
	}

	if cfg.Port == "" {
		cfg.Port = "7777"
	}
	if cfg.DB_DSN == "" {
		log.Fatal("DB_DSN environment variable is required")
	}
	if cfg.JWTSecret == "" {
		log.Fatal("JWT_SECRET environment variable is required")
	}

	return cfg
}
