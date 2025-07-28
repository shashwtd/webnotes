package database

import (
	"fmt"
	"slices"
	"strings"
)

func (db *DB) CountNotes(userID string) (int64, error) {
	_, count, err := db.client.From("notes").Select("*", "exact", true).Eq("user_id", userID).Limit(1, "").Execute()
	if err != nil {
		return 0, fmt.Errorf("count notes: %w", err)
	}
	return count, nil
}

// GetSourceIdentifiersByUserID retrieves all source identifiers for a specific user.
func (db *DB) GetSourceIdentifiersByUserID(userID string) ([]string, error) {
	var identifiers []string
	var output []struct {
		SourceIdentifier string `json:"source_identifier"`
	}

	_, err := db.client.From("notes").Select("source_identifier", "", false).Eq("user_id", userID).ExecuteTo(&output)
	if err != nil {
		return nil, err
	}

	for _, item := range output {
		identifiers = append(identifiers, item.SourceIdentifier)
	}

	return identifiers, nil
}

// GetNoteByID retrieves a note by its ID. It includes the body.
func (db *DB) GetNoteByID(noteID string) (*Note, error) {
	var note Note
	_, err := db.client.From("notes").Select("*", "", false).Eq("id", noteID).Single().ExecuteTo(&note)
	if err != nil {
		return nil, err
	}
	return &note, nil
}

// GetNoteBySlug retrieves a note by its username and slug. It includes the body.
func (db *DB) GetNoteBySlug(username, slug string) (*Note, error) {
	var note Note

	id, err := db.GetUserIDByUsername(username)
	if err != nil {
		return nil, fmt.Errorf("get user ID by username: %w", err)
	}

	_, err = db.client.From("notes").Select("*", "", false).Eq("user_id", id).Eq("slug", slug).Single().ExecuteTo(&note)
	if err != nil {
		return nil, err
	}
	return &note, nil
}

// ListNotes returns all notes in the database for a specific user. It does not provide the body of the notes.
func (db *DB) ListNotes(userID string) ([]Note, error) {
	var notes []Note
	_, err := db.client.From("notes").Select("id,user_id,source,source_identifier,created_at,updated_at,inserted_at,title,slug,deployed", "", false).Eq("user_id", userID).ExecuteTo(&notes)
	if err != nil {
		return nil, err
	}
	return notes, nil
}

// ListDeployedNotes returns all notes marked as deployed for a specific user. It does not provide the body of the notes.
func (db *DB) ListDeployedNotes(userID string) ([]Note, error) {
	var notes []Note
	_, err := db.client.From("notes").Select("id,user_id,source,source_identifier,created_at,updated_at,inserted_at,title,slug,deployed", "", false).Eq("user_id", userID).Eq("deployed", "true").ExecuteTo(&notes)
	if err != nil {
		return nil, fmt.Errorf("list deployed notes: %w", err)
	}
	return notes, nil
}

// InsertNote inserts a new note into the database and returns the inserted note with its ID.
// It expects the note to have the user_id, source, source_identifier, created_at,
// updated_at, title, and body fields set. The ID and inserted_at fields will be populated by the database.
// If the insertion fails, it returns an error.
func (db *DB) InsertNote(note *Note) error {
	if note.Slug == "" { // if slug is not set, generate one
		note.Slug = slugify(note.Title)
	}
	if note.Slug == "" { // if slug is still empty, generate a random slug
		note.Slug = randomB32(5)
	}

	_, err := db.client.From("notes").Insert(note, true, "user_id,source_identifier", "", "").Single().ExecuteTo(note)
	if err == nil { // exit early if no error
		return nil
	}

	// there is an error!

	// slug error? if the slug already exists, we will add a random suffix to it
	if strings.Contains(err.Error(), "duplicate key value violates unique constraint \"unique_user_slug\"") {
		note.Slug = fmt.Sprintf("%s-%s", note.Slug, randomB32(5))
		err = db.InsertNote(note) // try again with the new slug
	}

	// non-slug error or slug reattempt error? return error
	if err != nil {
		return fmt.Errorf("insert note: %w", err)
	}

	return nil
}

// UpdateNote updates an existing note in the database by its source identifier.
func (db *DB) UpdateNote(note *Note) error {
	db.client.From("notes").Update(note, "", "").Eq("source_identifier", note.SourceIdentifier).Single().ExecuteTo(note)
	return nil
}

func (db *DB) InsertNotesForUser(userID string, notes []Note) error {
	identifiers, err := db.GetSourceIdentifiersByUserID(userID)
	if err != nil {
		return fmt.Errorf("get source identifiers: %w", err)
	}

	for _, note := range notes {
		note.UserID = userID
		if slices.Contains(identifiers, note.SourceIdentifier) {
			// note already exists in the database, update it
			err = db.UpdateNote(&note)
			continue
		} else {
			// note does not exist, insert it
			err = db.InsertNote(&note)
		}
		if err != nil { // true if slug attempt failed or any other error
			return err
		}
	}

	return nil
}
