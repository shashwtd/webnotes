package api

import (
	"errors"
	"log/slog"
	"strings"

	"github.com/gofiber/fiber/v2"
)

var (
	ErrNonDeployedNoteNotAccessible = errors.New("non-deployed note is not accessible to non-owners")
)

// ErrorPattern represents a pattern to match and its corresponding status and message
type errorPattern struct {
	Contains   []string
	StatusCode int
	Message    string
}

var errorPatterns = []errorPattern{
	{
		Contains:   []string{"duplicate key value violates unique constraint", "users_email_address_key"},
		StatusCode: fiber.StatusConflict,
		Message:    "email already exists, use a different email or log in",
	},
	{
		Contains:   []string{"duplicate key value violates unique constraint", "users_username_key"},
		StatusCode: fiber.StatusConflict,
		Message:    "username already in use, use a different username or log in",
	},
	{
		Contains:   []string{"invalid input syntax for type uuid"},
		StatusCode: fiber.StatusUnprocessableEntity,
		Message:    "the id passed is invalid",
	},
	{
		Contains:   []string{"no rows in result set", "multiple (or no) rows returned"},
		StatusCode: fiber.StatusNotFound,
		Message:    "the requested resource was not found or you do not have access to it",
	},
	{
		Contains:   []string{"get last activity by type", "multiple (or no) rows returned"},
		StatusCode: fiber.StatusNotFound,
		Message:    "no activities of the requested type found",
	},
	{
		Contains:   []string{ErrNonDeployedNoteNotAccessible.Error()},
		StatusCode: fiber.StatusNotFound,
		Message:    "the requested resource was not found or you do not have access to it",
	},
	{
		Contains:   []string{"request Content-Type has bad boundary", "multipart/form-data"},
		StatusCode: fiber.StatusBadRequest,
		Message:    "the request is not a valid multipart/form-data request (hint: no file uploaded or invalid content type)",
	},
	{
		Contains:   []string{"hashedPassword is not the hash of the given password"},
		StatusCode: fiber.StatusUnauthorized,
		Message:    "the username or password is incorrect",
	},
}

func sendError(c *fiber.Ctx, err error) error {
	if err == nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"error": nil})
	}

	errMessage := err.Error()

	// Match known patterns
	for _, pattern := range errorPatterns {
		matched := true
		for _, substr := range pattern.Contains { // see if all contains substrs are in the error message
			if !strings.Contains(errMessage, substr) {
				matched = false
				break // if any substring does not match, skip to the next pattern
			}
		}
		if matched { // matched with this pattern, send the message and status code
			return c.Status(pattern.StatusCode).JSON(fiber.Map{
				"error": pattern.Message,
			})
		}
		// if not matched, continue to the next pattern
	}

	slog.Error("unmatched error", "error", errMessage)

	// Default error
	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		"error": "an error occurred, please try again later",
	})
}

func sendStringError(c *fiber.Ctx, statusCode int, message string) error {
	return c.Status(statusCode).JSON(fiber.Map{
		"error": message,
	})
}
