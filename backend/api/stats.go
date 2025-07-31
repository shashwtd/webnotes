package api

import (
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"github.com/shashwtd/webnotes/backend/env"
	"github.com/shashwtd/webnotes/backend/session"
	"github.com/shashwtd/webnotes/database"
)

func setStatsGroup(router fiber.Router) {
	requiredSM := session.RequiredSessionMiddleware()

	router.Get("/", requiredSM, func(c *fiber.Ctx) error {
		rawstats, err := env.Default.Database.GetUserStats(c.Locals("user").(*database.User).ID)
		if err != nil {
			slog.Error("get stats", "error", err)
			return sendError(c, err)
		}

		c.Set("Content-Type", "application/json")
		return c.SendString(rawstats) // defaults to 200 OK
	})
}
