package main

import (
	"log/slog"

	"github.com/ajiteshkumar/webnotes/backend/env"
	"github.com/ajiteshkumar/webnotes/backend/keep"

	"github.com/gofiber/fiber/v2"
)

func main() {
	env.Load()
	keep.Init() // depends on env

	app := fiber.New()

	api := app.Group("/api")
	api.Get("/keep/auth", func(c *fiber.Ctx) error {
		// redirect to google oauth
		return c.Redirect(keep.RedirectURL())
	})
	api.Get("/keep/redirect", func(c *fiber.Ctx) error {
		// redirect endpoint for oauth
		srv, err := keep.RecieveCode(c.Context(), c.Query("code"))
		if err != nil {
			slog.Error("failed to receive code", "error", err)
			return c.Status(fiber.StatusInternalServerError).SendString("code failure")
		}
		notes, err := srv.GetNotes(c.Context())
		if err != nil {
			slog.Error("failed to get notes", "error", err)
			return c.Status(fiber.StatusInternalServerError).SendString("notes retrieval failure")
		}
		return c.Status(fiber.StatusOK).JSON(notes)
	})

	if err := app.Listen(":8080"); err != nil {
		slog.Error("listen and server error", "error", err)
		return
	}
}
