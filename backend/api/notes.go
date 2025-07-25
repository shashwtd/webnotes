package api

import (
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"github.com/shashwtd/webnotes/backend/env"
	"github.com/shashwtd/webnotes/database"
)

func setNotesGroup(router fiber.Router, sessionMiddleware fiber.Handler) {
	// /api/v1/notes

	router.Get("/list", sessionMiddleware, listNotes())  // GET /api/v1/notes/list (list all notes for the user)
	router.Post("/list", sessionMiddleware, saveNotes()) // POST /api/v1/notes/list (save a list of notes)

	router.Post("/", sessionMiddleware, createNote()) // POST /api/v1/notes (create a new note)
	router.Get("/:id", sessionMiddleware, getNote())  // GET /api/v1/notes/:id (get a note by ID)
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
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "notes saved successfully",
			"error":   nil,
		})
	})
}

func createNote() fiber.Handler {
	return handler(func(c *fiber.Ctx, body database.Note) error {
		if body.Source == "" || body.SourceIdentifier == "" || body.CreatedAt == "" || body.UpdatedAt == "" || body.Title == "" || body.Body == "" {
			return sendStringError(c, fiber.StatusBadRequest, "missing required fields")
		}
		user := c.Locals("user").(*database.User)
		body.UserID = user.ID

		err := env.Default.Database.InsertNote(&body)
		if err != nil {
			slog.Error("insert note", "error", err)
			return sendError(c, err)
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"note_id": body.ID,
			"error":   nil,
		})
	})
}

func getNote() fiber.Handler {
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
