package api

import (
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"github.com/shashwtd/webnotes/backend/env"
	"github.com/shashwtd/webnotes/database"
)

func setNotesGroup(router fiber.Router, sessionMiddleware fiber.Handler) {
	// /api/v1/notes

	// endpoint for the current user
	router.Get("/", sessionMiddleware, listNotes())       // GET /api/v1/notes/list (list all notes for the current user)
	router.Post("/", sessionMiddleware, saveNotes())      // POST /api/v1/notes/list (save a list of notes for the current user)
	router.Get("/count", sessionMiddleware, countNotes()) // GET /api/v1/notes/count (count all notes for the current user)

	// endpoint for not the current user
	router.Get("/:id", getNoteID())               // GET /api/v1/notes/:id (get a note by ID)
	router.Get("/:username/:slug", getNoteSlug()) // GET /api/v1/notes/:username/:id (get a note by ID for a specific user)
}

func listNotes() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(*database.User)
		notes, err := env.Default.Database.ListNotes(user.ID)
		if err != nil {
			slog.Error("list notes", "error", err)
			return sendError(c, err)
		}
		return c.JSON(notes) // defaults to 200 OK
	}
}

func countNotes() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(*database.User)
		count, err := env.Default.Database.CountNotes(user.ID)
		if err != nil {
			slog.Error("count notes", "error", err)
			return sendError(c, err)
		}
		return c.JSON(fiber.Map{
			"count": count,
			"error": nil,
		})
	}
}

func saveNotes() fiber.Handler {
	return handler(func(c *fiber.Ctx, body []database.Note) error {
		if len(body) == 0 {
			return sendStringError(c, fiber.StatusBadRequest, "no notes provided")
		}
		user := c.Locals("user").(*database.User) // ensure user is set in context by session middleware
		err := env.Default.Database.InsertNotesForUser(user.ID, body)
		if err != nil {
			slog.Error("insert notes for user", "error", err)
			return sendError(c, err)
		}

		setActivity(user.ID, ATClientSynced, onlineString(c, "%d notes synced successfully", len(body)))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "notes saved successfully",
			"error":   nil,
		})
	})
}

func getNoteID() fiber.Handler {
	return func(c *fiber.Ctx) error {
		noteID := c.Params("id")

		note, err := env.Default.Database.GetNoteByID(noteID)
		if err != nil {
			slog.Error("get note by ID", "error", err)
			return sendError(c, err)
		}

		return c.JSON(note)
	}
}

func getNoteSlug() fiber.Handler {
	return func(c *fiber.Ctx) error {
		username := c.Params("username")
		slug := c.Params("slug")

		note, err := env.Default.Database.GetNoteBySlug(username, slug)
		if err != nil {
			slog.Error("get note by username and slug", "error", err)
			return sendError(c, err)
		}

		return c.JSON(note)
	}
}
