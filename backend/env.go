package main

import "os"

type Environment struct {
	SupabaseURL string
	SupabaseKey string
}

var env Environment

func loadEnvironment() error {
	env.SupabaseURL = os.Getenv("SUPABASE_URL")
	env.SupabaseKey = os.Getenv("SUPABASE_KEY")
	return nil
}
