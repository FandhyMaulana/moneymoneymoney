package utils

import (
	"math"
	"money-manager/internal/dto"
)

func GetPaginationMeta(total int64, page, limit int) dto.PaginationMeta {
	totalPages := int(math.Ceil(float64(total) / float64(limit)))
	if totalPages == 0 {
		totalPages = 1
	}
	
	return dto.PaginationMeta{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}
}

func GetOffset(page, limit int) int {
	return (page - 1) * limit
}
