package api

import (
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"github.com/shashwtd/webnotes/backend/env"
	"github.com/shashwtd/webnotes/database"
)

func setProfileGroup(router fiber.Router, sessionMiddleware fiber.Handler) {
	// editing user profile
	router.Patch("/description", sessionMiddleware, editDescriptionHandler())
	router.Patch("/profile-picture", sessionMiddleware, editProfilePictureHandler())
}

func editDescriptionHandler() fiber.Handler {
	type expectedBody struct {
		Description string `json:"description"`
	}
	return handler(func(c *fiber.Ctx, body expectedBody) error {
		if body.Description == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "missing description field",
			})
		}

		user := c.Locals("user").(*database.User)
		user.Description = body.Description

		err := env.Default.Database.UpdateUserDescription(user)
		if err != nil {
			slog.Error("update user description", "error", err)
			return sendError(c, err)
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": nil,
		})
	})
}

func editProfilePictureHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(*database.User)
		fh, err := c.FormFile("profile_picture")
		if err != nil {
			slog.Error("get profile picture file", "error", err)
			return sendError(c, err)
		}

		file, err := fh.Open()
		if err != nil {
			slog.Error("open profile picture file", "error", err)
			sendError(c, err)
		}

		pfpURL, err := env.Default.Database.SaveProfilePicture(file, fh.Filename)
		if err != nil {
			slog.Error("save profile picture", "error", err)
			sendError(c, err)
		}
		user.ProfilePictureURL = pfpURL
		err = env.Default.Database.UpdateUserProfilePictureURL(user)
		if err != nil {
			slog.Error("update user profile picture URL", "error", err)
			sendError(c, err)
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error":               nil,
			"profile_picture_url": pfpURL,
		})
	}
}
