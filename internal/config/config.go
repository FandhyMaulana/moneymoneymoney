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

	return &Config{
		Port:      os.Getenv("PORT"),
		DB_DSN:    os.Getenv("DB_DSN"),
		JWTSecret: os.Getenv("JWT_SECRET"),
	}
}
