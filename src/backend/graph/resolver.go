package graph

import (
	"database/sql"
	"login-system/internal/service"
)

type Resolver struct {
	DB             *sql.DB
	PasskeyService *service.PasskeyService
}
