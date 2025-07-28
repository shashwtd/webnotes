package api

import (
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"github.com/shashwtd/webnotes/backend/env"
	"github.com/shashwtd/webnotes/backend/session"
	"github.com/shashwtd/webnotes/database"
)

func setNotesGroup(router fiber.Router) {
	// /api/v1/notes
	requiredSM := session.RequiredSessionMiddleware()
	optionalSM := session.OptionalSessionMiddleware()

	router.Get("/list", requiredSM, listNotes())                   // GET /api/v1/notes/list (list all notes for the current user)
	router.Get("/list/:username", optionalSM, listDeployedNotes()) // GET /api/v1/notes/list/:username (list all deployed notes for a specific user)
	router.Post("/list", requiredSM, saveNotes())                  // POST /api/v1/notes/list (save a list of notes for the current user)

	router.Post("/deploy/:id", requiredSM, deployNote())     // POST /api/v1/notes/deploy/:username (deploy notes for a specific user)
	router.Delete("/deploy/:id", requiredSM, undeployNote()) // DELETE /api/v1/notes/deploy/:username (undeploy notes for a specific user)

	router.Get("/count", requiredSM, countNotes()) // GET /api/v1/notes/count (count all notes for the current user)

	router.Get("/:id", optionalSM, getNoteID())               // GET /api/v1/notes/:id (get a note by ID)
	router.Get("/:username/:slug", optionalSM, getNoteSlug()) // GET /api/v1/notes/:username/:id (get a note by ID for a specific user)

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

func listDeployedNotes() fiber.Handler {
	return func(c *fiber.Ctx) error {
		username := c.Params("username")

		userID, err := env.Default.Database.GetUserIDByUsername(username)
		if err != nil {
			slog.Error("get user ID by username", "username", username, "error", err)
			return sendError(c, err)
		}

		notes, err := env.Default.Database.ListDeployedNotes(userID)

		// get the user id by username
		if err != nil {
			slog.Error("retrieve notes", "error", err)
			return sendError(c, err)
		}

		return c.JSON(notes)
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

func deployNote() fiber.Handler {
	return func(c *fiber.Ctx) error {
		noteID := c.Params("id")
		user := c.Locals("user").(*database.User) // ensure user is set in context by session middleware

		err := env.Default.Database.DeployNote(noteID, user.ID)
		if err != nil {
			slog.Error("deploy note", "error", err)
			return sendError(c, err)
		}

		setActivity(user.ID, ATNoteDeployed, onlineString(c, "note %s deployed successfully", noteID))

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "note deployed successfully",
			"error":   nil,
		})
	}
}

func undeployNote() fiber.Handler {
	return func(c *fiber.Ctx) error {
		noteID := c.Params("id")
		user := c.Locals("user").(*database.User) // ensure user is set in context by session middleware

		err := env.Default.Database.UndeployNote(noteID, user.ID)
		if err != nil {
			slog.Error("undeploy note", "error", err)
			return sendError(c, err)
		}

		setActivity(user.ID, ATNoteUndeployed, onlineString(c, "note %s undeployed successfully", noteID))

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "note undeployed successfully",
			"error":   nil,
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

		if !canUserAccessNote(c, note) {
			return sendError(c, ErrNonDeployedNoteNotAccessible)
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

		if !canUserAccessNote(c, note) {
			return sendError(c, ErrNonDeployedNoteNotAccessible)
		}

		return c.JSON(note)
	}
}

func canUserAccessNote(c *fiber.Ctx, note *database.Note) bool {
	var isOwner bool
	if c.Locals("user") != nil {
		user := c.Locals("user").(*database.User)
		isOwner = user.ID == note.UserID
	}
	return isOwner || note.Deployed
}
