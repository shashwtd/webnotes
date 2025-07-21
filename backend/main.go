package main

import (
	"log/slog"

	"github.com/ajiteshkumar/webnotes/backend/env"

	"github.com/gofiber/fiber/v2"
)

func main() {
	env.Load()

	app := fiber.New()

	if err := app.Listen(":8080"); err != nil {
		slog.Error("listen and server error", "error", err)
		return
	}
}
