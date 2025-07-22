package api

import (
	"github.com/ajiteshkumar/webnotes/backend/env"
	"github.com/gofiber/fiber/v2"
)

func SetGroup(group fiber.Router) {
	v1 := group.Group("/v1")

	v1.Get("/supabase", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"url":      env.Default.SupabaseURL,
			"anon_key": env.Default.SupabaseAnonKey,
		})
	})
}
