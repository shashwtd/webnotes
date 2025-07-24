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
	router.Get("/me", sessionMiddleware, func(c *fiber.Ctx) error {
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
	})

	router.Get("/authcode", sessionMiddleware, func(c *fiber.Ctx) error {
		// issue oauth code jwt
		code, err := session.JWTOAuthCode(c)
		if err != nil {
			slog.Error("create oauth code", "error", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "failed to create oauth code",
			})
		}
		slog.Info("issued oauth code", "code", code, "time", time.Now().Format(time.RFC3339))
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": nil,
			"code":  code,
		})
	})

	router.Get("/exchangeAuthCode", func(c *fiber.Ctx) error {
		code := c.Query("code")
		if code == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "missing code query parameter",
			})
		}
		sessionToken, err := session.ExchangeAuthCode(c, code)
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

	router.Get("/usernameExists", func(c *fiber.Ctx) error {
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
	})

	type loginExpectedBody struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	router.Post("/login", handler(func(c *fiber.Ctx, body loginExpectedBody) error {
		if (body.Username == "" && body.Email == "") || body.Password == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "missing fields (required username or email, and password)",
			})
		}

		// get user
		var user *database.User
		var err error
		if body.Username != "" {
			user, err = env.Default.Database.GetUserByUsername(body.Username)
		} else {
			user, err = env.Default.Database.GetUserByEmail(body.Email)
		}
		if err != nil {
			slog.Error("get user by username/email", "error", err)
			sendError(c, err)
		}

		// check password
		err = bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), []byte(body.Password))
		if err != nil {
			slog.Error("compare password hash", "error", err)
			sendError(c, err)
		}

		// issue a session jwt
		err = session.SetSession(c, user.ID, time.Hour*24*7) // expires in 7 days
		if err != nil {
			slog.Error("create new session", "error", err)
			sendError(c, err)
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": nil,
		})
	}))

	type registerExpectedBody struct {
		Email    string `json:"email"`
		Username string `json:"username"`
		Name     string `json:"name"`
		Password string `json:"password"`
	}
	router.Post("/register", handler(func(c *fiber.Ctx, body registerExpectedBody) error {
		if body.Email == "" || body.Username == "" || body.Name == "" || body.Password == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "missing fields (required email, username, name, and password)",
			})
		}

		// hash password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
		if err != nil {
			slog.Error("hash password", "error", err)
			sendError(c, err)
		}

		// write user to database
		user := &database.User{
			Username:          body.Username,
			Email:             body.Email,
			HashedPassword:    string(hashedPassword),
			Name:              body.Name,
			Description:       "",
			ProfilePictureURL: fmt.Sprintf("https://%s/storage/v1/object/public/pfps/default.jpg", env.Default.SupabaseURL),
		}
		err = env.Default.Database.InsertUser(user)
		if err != nil { // NOTE: we need to be able to tell when its a unique constraint error for username or email
			slog.Error("insert user", "error", err)
			return sendError(c, err)
		}

		// issue a session jwt and set it as a cookie
		err = session.SetSession(c, user.ID, time.Hour*24*7)
		if err != nil {
			slog.Error("create new session", "error", err)
			return sendError(c, err)
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"error": nil,
		})
	}))

	router.Get("/logout", func(c *fiber.Ctx) error {
		session.LogoutSession(c)
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": nil,
		})
	})
}
