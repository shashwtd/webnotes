package main

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"net/url"
	"time"

	"github.com/shashwtd/webnotes/database"
	"github.com/supabase-community/supabase-go"
)

type SupabaseKeys struct {
	URL     string `json:"url"`
	AnonKey string `json:"anon_key"`
}

func doWorker() error {
	slog.SetLogLoggerLevel(slog.LevelDebug)
	notes, err := extractNotes()
	if err != nil {
		return fmt.Errorf("extraction: %w", err)
	}
	slog.Info("extracted notes", "count", len(notes), "time", time.Now().Format(time.RFC3339))
	for _, note := range notes {
		slog.Info("note", "id", note.ID, "title", note.Title, "created", note.Created, "updated", note.Updated)
	}

	// get supabase keys
	resp, err := http.DefaultClient.Do(&http.Request{
		Method: http.MethodGet,
		URL:    &url.URL{Scheme: "http", Host: "localhost:8080", Path: "/api/v1/supabase"},
		Header: http.Header{
			"Accept": []string{"application/json"},
		},
	})
	if err != nil {
		return fmt.Errorf("getting supabase keys: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("getting supabase keys: status %s", resp.Status)
	}
	var keys SupabaseKeys
	if err := json.NewDecoder(resp.Body).Decode(&keys); err != nil {
		return fmt.Errorf("decoding supabase keys: %w", err)
	}
	slog.Info("supabase keys retrieved", "url", keys.URL, "anon_key", keys.AnonKey)

	// write to DB
	err = writeDB(keys, notes)
	if err != nil {
		return fmt.Errorf("writing to DB: %w", err)
	}
	slog.Info("notes written to DB", "count", len(notes), "time", time.Now().Format(time.RFC3339))

	return nil
}

func writeDB(keys SupabaseKeys, notes []database.Note) error {
	sbclient, err := supabase.NewClient(keys.URL, keys.AnonKey, &supabase.ClientOptions{
		Headers: map[string]string{
			// "Prefer": "return=representation",
		},
	})
	if err != nil {
		return fmt.Errorf("creating supabase client: %w", err)
	}
	for _, note := range notes {
		var ret []database.Note
		_, err := sbclient.From("notes").Insert(map[string]any{
			"user_id":           "352ecb4c-f39e-4c83-891d-5f10bd5653b5",
			"source":            "macos_apple_notes",
			"source_identifier": note.ID,
			"created_at":        note.Created,
			"updated_at":        note.Updated,
			"title":             note.Title,
			"body":              note.Body,
		}, true, "", "", "").ExecuteTo(&ret)
		if err != nil {
			return fmt.Errorf("inserting note %s: %w", note.ID, err)
		}
		slog.Info("note inserted", "id", ret[0].ID, "title", note.Title)
	}
	return nil
}
