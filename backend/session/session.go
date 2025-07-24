package session

import (
	"fmt"
	"log/slog"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/shashwtd/webnotes/backend/env"
	"github.com/shashwtd/webnotes/database"
)

const CookieName string = "session_token"

type Claims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

func LogoutSession(c *fiber.Ctx) {
	c.Cookie(&fiber.Cookie{
		Name:     CookieName,
		Value:    "",
		HTTPOnly: true,
		Secure:   true,
		MaxAge:   -1,                         // Set MaxAge to -1 to delete the cookie
		Expires:  time.Now().Add(-time.Hour), // Set Expires to a time in the past
	})
}

// NewSession creates a new session JWT.
func NewSession(userID string, validityDuration time.Duration) (string, error) {
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
		return "", fmt.Errorf("signing JWT token: %w", err)
	}

	return signedToken, nil
}

// SetSession creates a new session JWT and sets it as an HTTP only cookie in the response.
func SetSession(c *fiber.Ctx, userID string, validityDuration time.Duration) error {
	signedToken, err := NewSession(userID, validityDuration)
	if err != nil {
		return fmt.Errorf("creating new session: %w", err)
	}

	// Set the cookie in the response
	c.Cookie(&fiber.Cookie{
		Name:     CookieName,
		Value:    signedToken,
		HTTPOnly: true,
		Secure:   true,
	})

	slog.Info("session created", "user_id", userID, "time", time.Now().Format(time.RFC3339))
	return nil
}

// JWTOAuthCode creates a JWT for OAuth code flow.
func JWTOAuthCode(c *fiber.Ctx) (string, error) {
	user := c.Locals("user").(*database.User)
	claims := &Claims{
		UserID: user.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "webnotes",
			Subject:   "oauth_code",
			Audience:  []string{"webnotes_client"},
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 10)), // valid for 10 minutes
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(env.Default.JWTSigningKey)
	if err != nil {
		slog.Error("signing JWT token", "error", err, "time", time.Now().Format(time.RFC3339))
		return "", fmt.Errorf("signing JWT token: %w", err)
	}

	return signedToken, nil
}

func ExchangeAuthCode(c *fiber.Ctx, code string) (string, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(code, claims, func(token *jwt.Token) (any, error) {
		return env.Default.JWTSigningKey, nil
	})
	if err != nil {
		slog.Error("parse JWT token", "error", err)
		return "", fmt.Errorf("parsing JWT token: %w", err)
	}
	if !token.Valid {
		return "", fmt.Errorf("invalid JWT token")
	}

	sessionToken, err := NewSession(claims.UserID, time.Hour*24*2000) // create a new session for 2000 days (long lived for a reason lol)
	if err != nil {
		slog.Error("create new session", "error", err)
	}
	return sessionToken, nil
}

func SessionMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := &Claims{}

		token, err := jwt.ParseWithClaims(c.Cookies(CookieName), claims, func(token *jwt.Token) (interface{}, error) {
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
