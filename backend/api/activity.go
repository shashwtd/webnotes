package api

import (
	"log/slog"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/shashwtd/webnotes/backend/env"
	"github.com/shashwtd/webnotes/backend/session"
	"github.com/shashwtd/webnotes/database"
)

const (
	ATAccountCreated = "account_created"

	ATNewLogin         = "new_login"
	ATClientAuthorized = "client_authorized"

	ATProfileNameUpdated        = "profile_name_updated"
	ATProfileDescriptionUpdated = "profile_description_updated"
	ATProfilePictureUpdated     = "profile_picture_updated"
	ATProfileSocialsUpdated     = "profile_socials_updated"
	ATClientSynced              = "client_synced"
	ATNoteDeployed              = "note_deployed"
	ATNoteUndeployed            = "note_undeployed"
)

func isValidActivityType(at string) bool {
	switch at {
	case ATAccountCreated, ATNewLogin, ATClientAuthorized,
		ATProfileNameUpdated, ATProfileDescriptionUpdated, ATProfilePictureUpdated,
		ATClientSynced, ATNoteDeployed, ATNoteUndeployed:
		return true
	default:
		return false
	}
}

func setActivityGroup(router fiber.Router) {
	// /api/v1/activity
	sessionMiddleware := session.RequiredSessionMiddleware()

	router.Get("/", sessionMiddleware, listActivitiesHandler()) // list user activities
	router.Get("/:at", sessionMiddleware, lastOccurance())      // get last occurrence of a specific activity type
}

func listActivitiesHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(*database.User)

		rawLoadTime := c.QueryInt("load_time", 0)
		if rawLoadTime < 0 {
			slog.Error("invalid load time", "load_time", rawLoadTime)
			return sendStringError(c, fiber.StatusBadRequest, "invalid load time")
		}
		loadTime := time.UnixMilli(int64(rawLoadTime))
		offset := c.QueryInt("offset", 0)
		limit := c.QueryInt("limit", 25)

		activities, err := env.Default.Database.GetActivities(user.ID, loadTime, offset, limit)
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

		if !isValidActivityType(at) {
			slog.Error("invalid activity type", "type", at)
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
