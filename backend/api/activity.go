package api

import (
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"github.com/shashwtd/webnotes/backend/env"
	"github.com/shashwtd/webnotes/database"
)

const (
	ATAccountCreated            = "account_created"
	ATProfileDescriptionUpdated = "profile_description_updated"
	ATProfilePictureUpdated     = "profile_picture_updated"
	ATNoteCreated               = "note_created"
)

func setActivityGroup(router fiber.Router, sessionMiddleware fiber.Handler) {
	router.Get("/list", sessionMiddleware, listActivitiesHandler())
}

func listActivitiesHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(*database.User)
		activities, err := env.Default.Database.GetActivities(user.ID)
		if err != nil {
			slog.Error("get user activities", "error", err)
			return sendError(c, err)
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error":      nil,
			"activities": activities,
		})
	}
}
