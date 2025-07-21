package env

import "os"

type Environment struct {
	GoogleOAuthClientID     string
	GoogleOAuthClientSecret string

	SupabaseURL string
	SupabaseKey string
}

var Default Environment

func Load() error {
	Default.SupabaseURL = os.Getenv("SUPABASE_URL")
	Default.SupabaseKey = os.Getenv("SUPABASE_KEY")
	Default.GoogleOAuthClientID = os.Getenv("GOOGLE_OAUTH_CLIENT_ID")
	Default.GoogleOAuthClientSecret = os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET")
	return nil
}
