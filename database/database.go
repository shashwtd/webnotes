package database

import (
	"fmt"
	"io"
	"mime"
	"path/filepath"

	"github.com/google/uuid"
	"github.com/supabase-community/postgrest-go"
	storage_go "github.com/supabase-community/storage-go"
	"github.com/supabase-community/supabase-go"
)

// NOTE: json tag must match the column names in supabase

// User represents a user in the database.
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

// Note represents a note in the database.
type Note struct {
	ID               string `json:"id,omitempty"`
	UserID           string `json:"user_id"` // fk to users
	Source           string `json:"source"`
	SourceIdentifier string `json:"source_identifier"`
	CreatedAt        string `json:"created_at"`
	UpdatedAt        string `json:"updated_at"`
	InsertedAt       string `json:"inserted_at,omitempty"`
	Title            string `json:"title"`
	Slug             string `json:"slug"`
	Body             string `json:"body,omitempty"`
}

// Activity represents an activity in the database.
type Activity struct {
	ID     string `json:"id,omitempty"`
	UserID string `json:"user_id"` // fk to users

	ActivityType string `json:"activity_type"` // type of activity
	Description  string `json:"description"`   // description of the activity

	Timestamp string `json:"timestamp"` // time of occurrence
}

// DB is a wrapper around the Supabase client for database operations.
type DB struct {
	client        *supabase.Client
	pfps_bucketid string
}

// GetUserByID retrieves a user by their ID.
func (db *DB) GetUserByID(userID string) (*User, error) {
	var user User
	_, err := db.client.From("users").Select("*", "", false).Eq("id", userID).Single().ExecuteTo(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// GetUserByEmail retrieves a user by their email address.
func (db *DB) GetUserByEmail(email string) (*User, error) {
	var user User
	_, err := db.client.From("users").Select("*", "", false).Eq("email", email).Single().ExecuteTo(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// GetUserByUsername retrieves a user by their username.
func (db *DB) GetUserByUsername(username string) (*User, error) {
	var user User
	_, err := db.client.From("users").Select("*", "", false).Eq("username", username).Single().ExecuteTo(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// UsernameExists checks if a username already exists in the database.
func (db *DB) UsernameExists(username string) (bool, error) {
	_, ct, err := db.client.From("users").Select("*", "exact", true).Eq("username", username).Execute()
	if err != nil {
		return true, err // fail closed (assume exists)
	}
	return ct > 0, nil
}

// InsertUser inserts a new user into the database and populated the given user with its ID.
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

func (db *DB) CountNotes(userID string) (int64, error) {
	_, count, err := db.client.From("notes").Select("*", "exact", true).Eq("user_id", userID).Limit(1, "").Execute()
	if err != nil {
		return 0, fmt.Errorf("count notes: %w", err)
	}
	return count, nil
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
	_, err := db.client.From("notes").Insert(note, true, "user_id,source_identifier", "", "").ExecuteTo(&ret)
	if err != nil {
		return err
	}
	if len(ret) == 0 {
		return fmt.Errorf("inserted note is empty, something went wrong")
	}
	*note = ret[0]
	return nil
}

// InsertNotesForUser inserts multiple notes for a specific user.
func (db *DB) InsertNotesForUser(userID string, notes []Note) error {
	for i := range notes {
		notes[i].UserID = userID
	}
	_, _, err := db.client.From("notes").Insert(notes, true, "user_id,source_identifier", "", "").Execute()
	if err != nil {
		return err
	}
	return nil
}

// GetSourceIdentifiersByUserID retrieves all source identifiers for a specific user.
func (db *DB) GetSourceIdentifiersByUserID(userID string) ([]string, error) {
	var identifiers []string
	_, err := db.client.From("notes").Select("source_identifier", "", false).Eq("user_id", userID).ExecuteTo(&identifiers)
	if err != nil {
		return nil, err
	}
	return identifiers, nil
}

// UpdateName updates the name of a user in the database. It expects the user to have the new name set.
func (db *DB) UpdateName(user *User) error {
	_, _, err := db.client.From("users").Update(map[string]string{
		"name": user.Name,
	}, "", "").Eq("id", user.ID).Execute()
	return err
}

// UpdateUserDescription updates the description of a user in the database. It expects the user
// to have the new description set.
func (db *DB) UpdateUserDescription(user *User) error {
	_, _, err := db.client.From("users").Update(map[string]string{
		"description": user.Description,
	}, "", "").Eq("id", user.ID).Execute()
	return err
}

// UpdateUserProfilePictureURL updates the profile picture URL of a user in the database.
// It expects the user to have the new profile picture URL set.
func (db *DB) UpdateUserProfilePictureURL(user *User) error {
	_, _, err := db.client.From("users").Update(map[string]string{
		"profile_picture_url": user.ProfilePictureURL,
	}, "", "").Eq("id", user.ID).Execute()
	return err
}

// SaveProfilePicture saves a profile picture to the storage and returns its blob URL.
func (db *DB) SaveProfilePicture(file io.Reader, name string) (string, error) {
	id := uuid.New()
	ext := filepath.Ext(name)
	filename := id.String() + ext
	ct := mime.TypeByExtension(ext)
	_, err := db.client.Storage.UpdateFile(db.pfps_bucketid, filename, file, storage_go.FileOptions{
		ContentType: &ct,
	})

	if ext != ".png" && ext != ".jpg" && ext != ".jpeg" {
		return "", fmt.Errorf("unsupported file type: %s", ext)
	}

	if err != nil {
		return "", fmt.Errorf("save profile picture: %w", err)
	}
	return db.client.Storage.GetPublicUrl(
		db.pfps_bucketid,
		filename,
		storage_go.UrlOptions{}).SignedURL, nil
}

func (db *DB) GetActivities(userID string) ([]Activity, error) {
	var activities []Activity
	_, err := db.client.From("activities").Select("*", "", false).Eq("user_id", userID).Order("occurred_at", &postgrest.OrderOpts{
		Ascending: false,
	}).ExecuteTo(&activities)
	if err != nil {
		return nil, fmt.Errorf("get user activities: %w", err)
	}
	return activities, nil
}

// Database returns a new instance of DB initialized with the Supabase client.
func Database(sbURL, sbKey string) (*DB, error) {
	client, err := supabase.NewClient(sbURL, sbKey, nil)
	if err != nil {
		return nil, err
	}

	pfpBucketInfo, err := client.Storage.GetBucket("pfps")
	if err != nil {
		return nil, fmt.Errorf("get pfps bucket info: %w", err)
	}

	db := &DB{client: client, pfps_bucketid: pfpBucketInfo.Id}

	return db, nil
}
