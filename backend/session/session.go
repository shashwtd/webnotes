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
		MaxAge:   -1, // Set MaxAge to -1 to delete the cookie
		SameSite: fiber.CookieSameSiteNoneMode,
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
		SameSite: fiber.CookieSameSiteNoneMode,
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

func ExchangeAuthCode(c *fiber.Ctx, code string) (string, string, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(code, claims, func(token *jwt.Token) (any, error) {
		return env.Default.JWTSigningKey, nil
	})
	if err != nil {
		slog.Error("parse JWT token", "error", err)
		return "", "", fmt.Errorf("parsing JWT token: %w", err)
	}
	if !token.Valid {
		return "", "", fmt.Errorf("invalid JWT token")
	}

	sessionToken, err := NewSession(claims.UserID, time.Hour*24*2000) // create a new session for 2000 days (long lived for a reason lol)
	if err != nil {
		slog.Error("create new session", "error", err)
	}

	return claims.UserID, sessionToken, nil
}

// RequiredSessionMiddleware returns a middleware that requires a valid jwt session
// in the request cookies. It will retrieve the user from the database and set it in the context.
// If the session is invalid or not present, the request will not proceed and a 401 Unauthorized error will be
// returned.
func RequiredSessionMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		if err := sessionMiddleware(c); err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{ // middleware errors stop the request
				"error": "resource requires authentication",
			})
		}
		return c.Next()
	}
}

// OptionalSessionMiddleware returns a middleware that checks for a valid jwt session
// in the request cookies. If the session is valid, it retrieves the user from the database
// and sets it in the context. The request will still proceed even if the session is invalid
// or not present.
func OptionalSessionMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		sessionMiddleware(c)
		return c.Next() // middleware errors do not stop the request
	}
}

// sessionMiddleware is a middleware that checks for a valid JWT session token in the request cookies.
// If the token is valid, it retrieves the user from the database and sets it in the context.
// If the token is invalid or not present, it returns an error.
func sessionMiddleware(c *fiber.Ctx) error {
	claims := &Claims{}

	if c.Cookies(CookieName) == "" {
		slog.Error("missing session token cookie")
		return fmt.Errorf("missing session token cookie")
	}
	token, err := jwt.ParseWithClaims(c.Cookies(CookieName), claims, func(token *jwt.Token) (interface{}, error) {
		return env.Default.JWTSigningKey, nil
	})
	if err != nil {
		slog.Error("parse JWT token", "error", err)
		return fmt.Errorf("parsing JWT token: %w", err)
	}
	if !token.Valid {
		slog.Error("invalid JWT token")
		return fmt.Errorf("invalid JWT token")
	}

	user, err := env.Default.Database.GetUserByID(claims.UserID)
	if err != nil {
		slog.Error("get user by ID", "error", err)
		return fmt.Errorf("getting user from db: %w", err)
	}

	c.Locals("user", user)

	return nil
}
