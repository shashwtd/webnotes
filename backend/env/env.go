package env

import "os"

type Environment struct {
	SupabaseURL            string
	SupabaseServiceRoleKey string
	SupabaseAnonKey        string
}

var Default Environment

func Load() error {
	Default.SupabaseURL = os.Getenv("SUPABASE_URL")
	Default.SupabaseServiceRoleKey = os.Getenv("SUPABASE_KEY")
	Default.SupabaseAnonKey = os.Getenv("SUPABASE_ANON_KEY")
	return nil
}
