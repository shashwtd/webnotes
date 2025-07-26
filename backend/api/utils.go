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

func slugify(s string) string {
	s = strings.TrimSpace(s)
	s = strings.ToLower(s)

	// ensure only alphanumeric characters, hyphens, and underscores are kept
	b := strings.Builder{}
	b.Grow(len(s)) // avoid a trillion allocations
	for _, r := range s {
		if isAlphanumeric(r) || r == '-' || r == '_' {
			b.WriteRune(r)
		}
	}

	result := b.String()

	// limit to 12 characters
	if len(result) > 12 {
		result = result[:12]
	}
	// trim trailing non-alphanumeric characters
	for len(result) > 0 && !isAlphanumeric(rune(result[len(result)-1])) {
		result = result[:len(result)-1]
	}

	return result
}

func isAlphanumeric(r rune) bool {
	return unicode.IsLetter(r) || unicode.IsDigit(r)
}
