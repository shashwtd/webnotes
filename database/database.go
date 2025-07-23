package database

import (
	"fmt"

	"github.com/supabase-community/supabase-go"
)

// NOTE: json tag must match the column names in supabase

type User struct {
	ID        string `json:"id,omitempty"`
	CreatedAt string `json:"created_at,omitempty"`
	Username  string `json:"username"`
	Email     string `json:"email_address"`

	HashedPassword string `json:"password_b64_hash"`

	Name              string `json:"name"`
	Description       string `json:"description"`
	ProfilePictureURL string `json:"profile_picture_url"`
}

type Note struct {
	ID               string `json:"id,omitempty"`
	UserID           string `json:"user_id"` // fk to users
	Source           string `json:"source"`
	SourceIdentifier string `json:"source_identifier"`
	CreatedAt        string `json:"created_at"`
	UpdatedAt        string `json:"updated_at"`
	InsertedAt       string `json:"inserted_at,omitempty"`
	Title            string `json:"title"`
	Body             string `json:"body,omitempty"`
}

type DB struct {
	client *supabase.Client
}

func (db *DB) GetUserByID(userID string) (*User, error) {
	var user User
	_, err := db.client.From("users").Select("*", "", false).Eq("id", userID).Single().ExecuteTo(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (db *DB) GetUserByEmail(email string) (*User, error) {
	var user User
	_, err := db.client.From("users").Select("*", "", false).Eq("email", email).Single().ExecuteTo(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (db *DB) GetUserByUsername(username string) (*User, error) {
	var user User
	_, err := db.client.From("users").Select("*", "", false).Eq("username", username).Single().ExecuteTo(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (db *DB) UsernameExists(username string) (bool, error) {
	_, ct, err := db.client.From("users").Select("*", "exact", true).Eq("username", username).Execute()
	if err != nil {
		return true, err // fail closed (assume exists)
	}
	return ct > 0, nil
}

func (db *DB) InsertUser(user *User) error {
	var ret []User
	_, err := db.client.From("users").Insert(user, false, "", "", "").ExecuteTo(&ret)
	if err != nil {
		return err
	}
	if len(ret) == 0 {
		return fmt.Errorf("inserted user is empty, something went wrong")
	}
	*user = ret[0]
	return nil
}

// ListNotes returns all notes in the database for a specific user. It does not provide the body of the notes.
func (db *DB) ListNotes(userID string) ([]Note, error) {
	var notes []Note
	_, err := db.client.From("notes").Select("id,user_id,source,source_identifier,created_at,updated_at,inserted_at,title", "", false).Eq("user_id", userID).ExecuteTo(&notes)
	if err != nil {
		return nil, err
	}
	return notes, nil
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

// InsertNote inserts a new note into the database and returns the inserted note with its ID.
// It expects the note to have the user_id, source, source_identifier, created_at,
// updated_at, title, and body fields set. The ID and inserted_at fields will be populated by the database.
// If the insertion fails, it returns an error.
func (db *DB) InsertNote(note *Note) error {
	var ret []Note
	_, err := db.client.From("notes").Insert(note, true, "", "", "").ExecuteTo(&ret)
	if err != nil {
		return err
	}
	if len(ret) == 0 {
		return fmt.Errorf("inserted note is empty, something went wrong")
	}
	*note = ret[0]
	return nil
}

func (db *DB) GetSourceIdentifiersByUserID(userID string) ([]string, error) {
	var identifiers []string
	_, err := db.client.From("notes").Select("source_identifier", "", false).Eq("user_id", userID).ExecuteTo(&identifiers)
	if err != nil {
		return nil, err
	}
	return identifiers, nil
}

// Database returns a new instance of DB initialized with the Supabase client.
func Database(sbURL, sbKey string) (*DB, error) {
	client, err := supabase.NewClient(sbURL, sbKey, nil)
	if err != nil {
		return nil, err
	}

	db := &DB{client: client}

	return db, nil
}
