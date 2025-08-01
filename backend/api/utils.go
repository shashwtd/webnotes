package api

import (
	"fmt"
	"regexp"
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

var validSocialUsernameRegexp = regexp.MustCompile(`^[a-zA-Z0-9_.-]+$`)

// isGoodSocialUsername checks if the given string is a valid social media username. It does
// not do full validation, its more of a basic check. It does not enforce platform-specific rules for length
// or trailing and leading non-alphanumeric characters, but it checks for valid characters and length.
func isGoodSocialUsername(s string) bool {
	return validSocialUsernameRegexp.MatchString(s) && len(s) <= 39
}

func isAlphanumeric(r rune) bool {
	return unicode.IsLetter(r) || unicode.IsDigit(r)
}

// onlineString returns a formatted string that includes information about the request using
// the context.
func onlineString(c *fiber.Ctx, s string, a ...any) string {
	return fmt.Sprintf("%s (ip: %s)", fmt.Sprintf(s, a...), c.IP())
}

func omitempty(m map[string]any, key string, value string) {
	if value != "" {
		m[key] = value
	}
}
