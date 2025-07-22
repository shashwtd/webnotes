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
	ID      string `json:"id"`
	Created string `json:"created"`
	Updated string `json:"updated"`
	Title   string `json:"title"`
	Body    string `json:"body"`
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

func (db *DB) GetUserByUsername(email string) (*User, error) {
	var user User
	_, err := db.client.From("users").Select("*", "", false).Eq("username", email).Single().ExecuteTo(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
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

// Database returns a new instance of DB initialized with the Supabase client.
func Database(sbURL, sbKey string) (*DB, error) {
	client, err := supabase.NewClient(sbURL, sbKey, nil)
	if err != nil {
		return nil, err
	}

	db := &DB{client: client}

	return db, nil
}
