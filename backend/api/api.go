package api

import (
	"github.com/gofiber/fiber/v2"
	"github.com/shashwtd/webnotes/backend/env"
	"github.com/shashwtd/webnotes/backend/session"
)

func SetAPIGroup(group fiber.Router) {
	v1 := group.Group("/v1")

	sessionMiddleware := session.SessionMiddleware()

	accountsRouter := v1.Group("/accounts")
	setAccountsGroup(accountsRouter, sessionMiddleware)
	notesRouter := v1.Group("/notes")
	setNotesGroup(notesRouter, sessionMiddleware)

	v1.Get("/supabase", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"url":      env.Default.SupabaseURL,
			"anon_key": env.Default.SupabaseAnonKey,
		})
	})
}
