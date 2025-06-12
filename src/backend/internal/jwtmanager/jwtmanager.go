package jwtmanager

import (
	"crypto/rand"
	"encoding/base64"
	"log"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const (
	secretLength      = 48               // 48 bytes → ~64 base64 chars
	rotationInterval  = 10 * time.Minute // Rotate every 10 min
	maxSecretLifetime = 24 * time.Hour   // Keep secrets for 1 day
)

type jwtSecret struct {
	secret    []byte
	generated time.Time
}

// Package jwtmanager provides JWT token generation and verification with secret rotation.
var (
	mu      sync.RWMutex
	secrets []jwtSecret // Newest first
)

// GenerateJWT creates a new JWT token for the given user ID and email.
func GenerateJWT(userID string, email string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"email":   email,
		"exp":     time.Now().Add(24 * time.Hour).Unix(), // token expiry 1 day
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(CurrentSecret())
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// Generate a new random secret
func genSecret() []byte {
	b := make([]byte, secretLength)
	if _, err := rand.Read(b); err != nil {
		log.Fatalf("Failed to generate JWT secret: %v", err)
	}
	return []byte(base64.RawURLEncoding.EncodeToString(b))
}

// Rotate secrets: add new, remove old
func rotateSecret() {
	mu.Lock()
	defer mu.Unlock()
	now := time.Now()
	secrets = append([]jwtSecret{{secret: genSecret(), generated: now}}, secrets...)
	// Prune old secrets
	cutoff := now.Add(-maxSecretLifetime)
	newSecrets := []jwtSecret{}
	for _, s := range secrets {
		if s.generated.After(cutoff) {
			newSecrets = append(newSecrets, s)
		}
	}
	secrets = newSecrets
}

// Start rotation goroutine
func StartRotation() {
	rotateSecret() // Initial
	go func() {
		for {
			time.Sleep(rotationInterval)
			rotateSecret()
		}
	}()
}

// For signing: always use latest secret
func CurrentSecret() []byte {
	mu.RLock()
	defer mu.RUnlock()
	if len(secrets) == 0 {
		log.Fatal("No JWT secret available")
	}
	return secrets[0].secret
}

// For verifying: try all secrets (newest first)
func VerifyJWT(tokenString string) (*jwt.Token, error) {
	mu.RLock()
	defer mu.RUnlock()
	var lastErr error
	for _, s := range secrets {
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return s.secret, nil
		})
		if err == nil && token.Valid {
			return token, nil
		}
		lastErr = err
	}
	return nil, lastErr
}
