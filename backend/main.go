package main

import (
	"log/slog"

	"github.com/shashwtd/webnotes/backend/api"
	"github.com/shashwtd/webnotes/backend/env"
	"github.com/shashwtd/webnotes/database"

	"github.com/gofiber/fiber/v2"
)

func main() {
	var err error
	if err = env.Load(); err != nil {
		slog.Error("failed to load environment variables", "error", err)
		return
	}
	env.Default.Database, err = database.Database(
		env.Default.SupabaseURL,
		env.Default.SupabaseServiceRoleKey,
	)
	if err != nil {
		slog.Error("failed to connect to database", "error", err)
		return
	}

	app := fiber.New()

	apiGroup := app.Group("/api")
	api.SetAPIGroup(apiGroup)

	if err := app.Listen(":8080"); err != nil {
		slog.Error("listen and server error", "error", err)
		return
	}
}
