package domain

import (
	"time"

	"gorm.io/gorm"
)

type Category struct {
	ID        string         `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID    string         `gorm:"type:uuid;not null;index" json:"user_id"`
	Name      string         `gorm:"type:varchar(255);not null" json:"name"`
	ParentID  *string        `gorm:"type:uuid;index" json:"parent_id"`
	IsSystem  bool           `gorm:"default:false" json:"is_system"`
	CreatedAt time.Time      `gorm:"not null" json:"created_at"`
	UpdatedAt *time.Time     `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
