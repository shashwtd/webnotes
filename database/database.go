package database

import (
	"fmt"

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

	TwitterUsername   string `json:"twitter_username,omitempty"`
	InstagramUsername string `json:"instagram_username,omitempty"`
	GithubUsername    string `json:"github_username,omitempty"`

	HasConnectedClient bool `json:"has_connected_client"` // whether the user has connected the client app
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
	Slug             string `json:"slug,omitempty"`
	Body             string `json:"body,omitempty"`

	Deployed bool  `json:"deployed"`
	Views    int64 `json:"views"`
}

// Activity represents an activity in the database.
type Activity struct {
	ID     string `json:"id,omitempty"`
	UserID string `json:"user_id"` // fk to users

	Type        string `json:"type"`        // type of activity
	Description string `json:"description"` // description of the activity

	Timestamp string `json:"timestamp,omitempty"` // time of occurrence
}

// DB is a wrapper around the Supabase client for database operations.
type DB struct {
	client        *supabase.Client
	pfps_bucketid string
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
