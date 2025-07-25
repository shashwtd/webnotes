package api

import (
	"fmt"
	"log/slog"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/shashwtd/webnotes/backend/env"
	"github.com/shashwtd/webnotes/backend/session"
	"github.com/shashwtd/webnotes/database"
	"golang.org/x/crypto/bcrypt"
)

func setAccountsGroup(router fiber.Router, sessionMiddleware fiber.Handler) {
	// me!!
	router.Get("/me", sessionMiddleware, getMeHandler())

	// authorization code flow related endpoints
	router.Get("/authcode", sessionMiddleware, getAuthCodeHandler())
	router.Post("/exchangeAuthCode", exchangeAuthCodeHandler())

	// username existence check
	router.Get("/usernameExists", usernameExistsHandler())

	// user registration, login, and logout
	router.Post("/login", loginHandler())
	router.Post("/register", registerHandler())
	router.Get("/logout", logoutHandler())

	// editing user profile
	router.Patch("/edit/description", sessionMiddleware, editDescriptionHandler())
	router.Patch("/edit/profile-picture", sessionMiddleware, editProfilePictureHandler())
}

func getMeHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(*database.User)
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"id":                  user.ID,
			"email":               user.Email,
			"username":            user.Username,
			"name":                user.Name,
			"description":         user.Description,
			"profile_picture_url": user.ProfilePictureURL,
			"created_at":          user.CreatedAt,
		})
	}
}

func getAuthCodeHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		code, err := session.JWTOAuthCode(c)
		if err != nil {
			slog.Error("create oauth code", "error", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "failed to create oauth code",
			})
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": nil,
			"code":  code,
		})
	}
}

func exchangeAuthCodeHandler() fiber.Handler {
	type exchangeAuthCodeExpectedBody struct {
		Code string `json:"code"`
	}

	return handler(func(c *fiber.Ctx, body exchangeAuthCodeExpectedBody) error {
		if body.Code == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "missing code field",
			})
		}
		sessionToken, err := session.ExchangeAuthCode(c, body.Code)
		if err != nil {
			slog.Error("exchange auth code for long-lived session", "error", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "failed to exchange auth code",
			})
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error":         nil,
			"session_token": sessionToken,
		})
	})
}

func usernameExistsHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		username := c.Query("username")
		if username == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "missing username query parameter",
			})
		}
		exists, err := env.Default.Database.UsernameExists(username)
		if err != nil {
			slog.Error("check if username exists", "error", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "failed to check if username exists",
			})
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error":  nil,
			"exists": exists,
		})
	}
}

func loginHandler() fiber.Handler {
	type loginExpectedBody struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	return handler(func(c *fiber.Ctx, body loginExpectedBody) error {
		if (body.Username == "" && body.Email == "") || body.Password == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "missing fields (required username or email, and password)",
			})
		}

		var user *database.User
		var err error
		if body.Username != "" {
			user, err = env.Default.Database.GetUserByUsername(body.Username)
		} else {
			user, err = env.Default.Database.GetUserByEmail(body.Email)
		}
		if err != nil {
			slog.Error("get user by username/email", "error", err)
			return sendError(c, err)
		}

		err = bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), []byte(body.Password))
		if err != nil {
			slog.Error("compare password hash", "error", err)
			return sendError(c, err)
		}

		err = session.SetSession(c, user.ID, time.Hour*24*7)
		if err != nil {
			slog.Error("create new session", "error", err)
			return sendError(c, err)
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": nil,
		})
	})
}

func registerHandler() fiber.Handler {
	type registerExpectedBody struct {
		Email    string `json:"email"`
		Username string `json:"username"`
		Name     string `json:"name"`
		Password string `json:"password"`
	}

	return handler(func(c *fiber.Ctx, body registerExpectedBody) error {
		if body.Email == "" || body.Username == "" || body.Name == "" || body.Password == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "missing fields (required email, username, name, and password)",
			})
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
		if err != nil {
			slog.Error("hash password", "error", err)
			return sendError(c, err)
		}

		user := &database.User{
			Username:          body.Username,
			Email:             body.Email,
			HashedPassword:    string(hashedPassword),
			Name:              body.Name,
			Description:       "",
			ProfilePictureURL: fmt.Sprintf("https://%s/storage/v1/object/public/pfps/default.jpg", env.Default.SupabaseURL),
		}
		err = env.Default.Database.InsertUser(user)
		if err != nil {
			slog.Error("insert user", "error", err)
			return sendError(c, err)
		}

		err = session.SetSession(c, user.ID, time.Hour*24*7)
		if err != nil {
			slog.Error("create new session", "error", err)
			return sendError(c, err)
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"error": nil,
		})
	})
}

func logoutHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		session.LogoutSession(c)
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": nil,
		})
	}
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
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "could not get profile picture file",
			})
		}

		file, err := fh.Open()
		if err != nil {
			slog.Error("open profile picture file", "error", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "could not open profile picture file",
			})
		}

		pfpURL, err := env.Default.Database.SaveProfilePicture(file, fh.Filename)
		if err != nil {
			slog.Error("save profile picture", "error", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "could not save profile picture",
			})
		}
		user.ProfilePictureURL = pfpURL
		err = env.Default.Database.UpdateUserProfilePictureURL(user)
		if err != nil {
			slog.Error("update user profile picture URL", "error", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "could not update profile picture URL",
			})
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error":               nil,
			"profile_picture_url": pfpURL,
		})
	}
}
