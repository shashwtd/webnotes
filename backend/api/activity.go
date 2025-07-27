package api

import (
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"github.com/shashwtd/webnotes/backend/env"
	"github.com/shashwtd/webnotes/database"
)

const (
	ATAccountCreated = "account_created"

	ATNewLogin         = "new_login"
	ATClientAuthorized = "client_authorized"

	ATProfileNameUpdated        = "profile_name_updated"
	ATProfileDescriptionUpdated = "profile_description_updated"
	ATProfilePictureUpdated     = "profile_picture_updated"
	ATClientSynced              = "client_synced"
)

func setActivityGroup(router fiber.Router, sessionMiddleware fiber.Handler) {
	router.Get("/", sessionMiddleware, listActivitiesHandler()) // list user activities
	router.Get("/:at", sessionMiddleware, lastOccurance())      // get last occurrence of a specific activity type
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

func lastOccurance() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(*database.User)
		at := c.Params("at")

		switch at {
		case ATAccountCreated, ATNewLogin, ATClientAuthorized, ATProfileDescriptionUpdated, ATProfilePictureUpdated, ATClientSynced:
		default:
			return sendStringError(c, fiber.StatusBadRequest, "invalid activity type")
		}

		activity, err := env.Default.Database.GetLastActivityByType(user.ID, at)
		if err != nil {
			slog.Error("get last activity by type", "error", err)
			return sendError(c, err)
		}

		if activity == nil {
			return sendStringError(c, fiber.StatusNotFound, "no activity found for this type")
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error":    nil,
			"activity": activity,
		})
	}
}

// setActivity logs an activity for a user. This function is used within the application
// to log events such as account creation, profile updates, etc.
func setActivity(user_id string, activityType string, description string) error {
	activity := &database.Activity{
		UserID:      user_id,
		Type:        activityType,
		Description: description,
	}

	if err := env.Default.Database.InsertActivity(activity); err != nil {
		slog.Error("create activity", "error", err)
		return err
	}

	return nil
}
