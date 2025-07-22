package session

import (
	"fmt"
	"log/slog"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/shashwtd/webnotes/backend/env"
)

type Claims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

// NewSession creates a new session JWT and sets it as an HTTP only cookie in the response.
func NewSession(c *fiber.Ctx, userID string, validityDuration time.Duration) error {
	claims := &Claims{
		UserID: userID, // This should be set based on your authentication logic
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "webnotes",
			Subject:   "session_token",
			Audience:  []string{"webnotes_client"},
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(validityDuration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(env.Default.JWTSigningKey)
	if err != nil {
		return fmt.Errorf("signing JWT token: %w", err)
	}

	c.Cookie(&fiber.Cookie{
		Name:     "session_token",
		Value:    signedToken,
		HTTPOnly: true,
		Secure:   true,
	})

	return nil
}

func SessionMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := &Claims{}

		token, err := jwt.ParseWithClaims(c.Cookies("session_token"), claims, func(token *jwt.Token) (interface{}, error) {
			return env.Default.JWTSigningKey, nil
		})
		if err != nil {
			slog.Error("parse JWT token", "error", err)
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "unauthorized",
			})
		}
		if !token.Valid {
			slog.Error("invalid JWT token")
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "unauthorized",
			})
		}

		user, err := env.Default.Database.GetUserByID(claims.UserID)
		if err != nil {
			slog.Error("get user by ID", "error", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "user not found",
			})
		}

		c.Locals("user", user)

		return c.Next()
	}
}
