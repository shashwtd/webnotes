package env

import (
	"encoding/hex"
	"fmt"
	"os"

	"github.com/shashwtd/webnotes/database"
)

type Environment struct {
	SupabaseURL            string // SUPABASE_URL
	SupabaseServiceRoleKey string // SUPABASE_SR_KEY
	SupabaseAnonKey        string // SUPABASE_ANON_KEY

	JWTSigningKey []byte // JWT_SIGNING_KEY (hex encoded)

	Database *database.DB // database from database.Database function (should be set in main.go)
}

var Default Environment

func Load() error {
	Default.SupabaseURL = os.Getenv("SUPABASE_URL")
	Default.SupabaseServiceRoleKey = os.Getenv("SUPABASE_SR_KEY")
	Default.SupabaseAnonKey = os.Getenv("SUPABASE_ANON_KEY")

	rawSigningKey := os.Getenv("JWT_SIGNING_KEY")
	if rawSigningKey == "" {
		return fmt.Errorf("JWT_SIGNING_KEY environment variable is not set")
	}
	Default.JWTSigningKey = make([]byte, hex.DecodedLen(len(rawSigningKey)))
	_, err := hex.Decode(Default.JWTSigningKey, []byte(rawSigningKey))
	if err != nil {
		return fmt.Errorf("decoding hex JWT signing key from env variable: %w", err)
	}

	return nil
}
