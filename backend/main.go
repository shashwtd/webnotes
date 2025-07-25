package main

import (
	"log/slog"

	"github.com/shashwtd/webnotes/backend/api"
	"github.com/shashwtd/webnotes/backend/env"
	"github.com/shashwtd/webnotes/database"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
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
	if env.Default.Debug {
		app.Use(cors.New(cors.Config{
			AllowOrigins:     "http://localhost:3000",
			AllowCredentials: true,
		}))
	} else {
		app.Use(cors.New(cors.Config{
			AllowOrigins:     "https://webnotes-murex.vercel.app",
			AllowCredentials: true,
		}))
	}

	apiGroup := app.Group("/api")
	api.SetAPIGroup(apiGroup)

	if err := app.Listen(":8080"); err != nil {
		slog.Error("listen and server error", "error", err)
		return
	}
}
