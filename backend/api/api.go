package api

import (
	"github.com/gofiber/fiber/v2"
	"github.com/shashwtd/webnotes/backend/env"
)

func SetAPIGroup(group fiber.Router) {
	v1 := group.Group("/v1")

	accountsRouter := v1.Group("/accounts")
	setAccountsGroup(accountsRouter)
	notesRouter := v1.Group("/notes")
	setNotesGroup(notesRouter)
	profileRouter := v1.Group("/profile")
	setProfileGroup(profileRouter)
	activityRouter := v1.Group("/activity")
	setActivityGroup(activityRouter)
	binariesRouter := v1.Group("/binaries")
	setBinaryGroup(binariesRouter)
	statsRouter := v1.Group("/stats")
	setStatsGroup(statsRouter)

	v1.Get("/supabase", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"url":      env.Default.SupabaseURL,
			"anon_key": env.Default.SupabaseAnonKey,
		})
	})
}
