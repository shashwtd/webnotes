package database

import (
	"crypto/rand"
	"encoding/base32"
	"strings"
	"unicode"
)

// returns random b32 where n is the number of bytes
func randomB32(n int) string {
	b := make([]byte, n)
	rand.Read(b)
	return base32.StdEncoding.EncodeToString(b)
}

func slugify(s string) string {
	s = strings.TrimSpace(s)
	s = strings.ToLower(s)

	// ensure only alphanumeric characters, hyphens, and underscores are kept
	b := strings.Builder{}
	b.Grow(len(s)) // avoid a trillion allocations
	for _, r := range s {
		if isAlphanumeric(r) || r == '-' {
			b.WriteRune(r)
		}
		if r == ' ' || r == '_' {
			b.WriteRune('-') // replace spaces with hyphens
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
