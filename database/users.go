package database

import (
	"fmt"
	"io"
	"mime"
	"path/filepath"

	"github.com/google/uuid"
	storage_go "github.com/supabase-community/storage-go"
)

// getting stuff

// GetUserIDByUsername retrieves the user ID by their username.
func (db *DB) GetUserIDByUsername(username string) (string, error) {
	var user User
	_, err := db.client.From("users").Select("id", "", false).Eq("username", username).Single().ExecuteTo(&user)
	if err != nil {
		return "", err
	}
	return user.ID, nil
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

// profile stuff

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

// insert stuff

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
