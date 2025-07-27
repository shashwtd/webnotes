package api

import (
	"strings"
	"unicode"

	"github.com/gofiber/fiber/v2"
)

func handler[T any](f func(c *fiber.Ctx, body T) error) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var body T
		if err := c.BodyParser(&body); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "parse request body for this request failed",
			})
		}
		return f(c, body)
	}
}

// goodString returns a string which is good for use in the application.
// It returns an empty string if the string cannot be made good.
func goodString(s string) string {
	s = strings.TrimSpace(s)
	s = strings.ToValidUTF8(s, "")

	for _, r := range s {
		if !isAlphanumeric(r) && r != '_' && r != '-' && r != ' ' {
			return ""
		}
	}
	return s
}

func isAlphanumeric(r rune) bool {
	return unicode.IsLetter(r) || unicode.IsDigit(r)
}
