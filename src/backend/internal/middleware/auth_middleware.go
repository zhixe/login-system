package middleware

import (
	"context"
	"errors"
	"github.com/golang-jwt/jwt/v5"
	"login-system/internal/jwtmanager"
	"net/http"
	"strings"
)

// Key type for context
type ctxKey string

const (
	UserCtxKey ctxKey = "user"
)

// JWTAuthMiddleware is a middleware that checks for a valid JWT token in the Authorization header.
func JWTAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), UserCtxKey, nil)))
			return
		}
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			http.Error(w, "Invalid Authorization header", http.StatusUnauthorized)
			return
		}
		tokenStr := parts[1]
		token, err := jwtmanager.VerifyJWT(tokenStr)
		if err != nil || !token.Valid {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		// Attach user_id and email to context
		userID, ok := claims["user_id"].(float64) // JWT numbers come as float64
		if !ok {
			http.Error(w, "UserID missing in token", http.StatusUnauthorized)
			return
		}
		email, _ := claims["email"].(string)

		ctx := context.WithValue(r.Context(), UserCtxKey, int(userID))
		ctx = context.WithValue(ctx, "email", email)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetUsernameFromCtx retrieves the username from the context.
func GetUsernameFromCtx(ctx context.Context) (string, error) {
	username, ok := ctx.Value(UserCtxKey).(string)
	if !ok || username == "" {
		return "", errors.New("user not authenticated")
	}
	return username, nil
}

// GetUserIDFromCtx retrieves the user ID from the context.
func GetUserIDFromCtx(ctx context.Context) int {
	userID, ok := ctx.Value(UserCtxKey).(int)
	if ok {
		return userID
	}
	return 0
}

// GetEmailFromCtx retrieves the user's email from context.
func GetEmailFromCtx(ctx context.Context) (string, error) {
	email, ok := ctx.Value("email").(string)
	if !ok || email == "" {
		return "", errors.New("email not found in context")
	}
	return email, nil
}
