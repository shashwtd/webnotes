package env

import "os"

type Environment struct {
	SupabaseURL string
	SupabaseKey string
}

var Default Environment

func Load() error {
	Default.SupabaseURL = os.Getenv("SUPABASE_URL")
	Default.SupabaseKey = os.Getenv("SUPABASE_KEY")
	return nil
}
