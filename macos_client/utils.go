package main

import (
	"crypto/rand"
	"encoding/hex"
)

// randomHex generates a random hexadecimal string of length n.
func randomHex(n int) string {
	b := make([]byte, n)
	rand.Read(b) // rand.Read never returns an error
	return hex.EncodeToString(b)
}
