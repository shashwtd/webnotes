package api

import (
	"fmt"
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"github.com/shashwtd/webnotes/backend/env"
	"github.com/shashwtd/webnotes/database"
)

// maybe this shouldn't be exported?
func DEFAULT_PROFILE_PICTURE_URL() string {
	const default_profile_picture_url = "%s/storage/v1/object/public/pfps/default.jpg"
	return fmt.Sprintf(default_profile_picture_url, env.Default.SupabaseURL)
}

func setProfileGroup(router fiber.Router, sessionMiddleware fiber.Handler) {
	// editing user profile
	router.Patch("/name", sessionMiddleware, editNameHandler())
	router.Patch("/description", sessionMiddleware, editDescriptionHandler())
	router.Patch("/profile-picture", sessionMiddleware, editProfilePictureHandler())
	router.Delete("/profile-picture", sessionMiddleware, deleteProfilePictureHandler())
}

func editNameHandler() fiber.Handler {
	type expectedBody struct {
		Name string `json:"name"`
	}
	return handler(func(c *fiber.Ctx, body expectedBody) error {
		user := c.Locals("user").(*database.User)
		user.Name = goodString(body.Name)
		if user.Name == "" {
			return sendStringError(c, fiber.StatusBadRequest, "name cannot be empty")
		}

		err := env.Default.Database.UpdateName(user)
		if err != nil {
			slog.Error("update user name", "error", err)
			return sendError(c, err)
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": nil,
		})
	})
}

func editDescriptionHandler() fiber.Handler {
	type expectedBody struct {
		Description string `json:"description"`
	}
	return handler(func(c *fiber.Ctx, body expectedBody) error {
		// empty description is allowed! (it will just clear the description)

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

		// open this file
		file, err := fh.Open()
		if err != nil {
			slog.Error("open profile picture file", "error", err)
			sendError(c, err)
		}

		// save the profile picture to blob storage and get the URL
		pfpURL, err := env.Default.Database.SaveProfilePicture(file, fh.Filename)
		if err != nil {
			slog.Error("save profile picture", "error", err)
			sendError(c, err)
		}

		// set the profile picture URL to the blob url
		user.ProfilePictureURL = pfpURL

		// update the profile picture URL in the database
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

func deleteProfilePictureHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(*database.User)

		// set the profile picture URL to the default profile picture URL
		user.ProfilePictureURL = DEFAULT_PROFILE_PICTURE_URL()

		err := env.Default.Database.UpdateUserProfilePictureURL(user)
		if err != nil {
			slog.Error("update user profile picture URL", "error", err)
			return sendError(c, err)
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error":               nil,
			"profile_picture_url": user.ProfilePictureURL,
		})
	}
}
