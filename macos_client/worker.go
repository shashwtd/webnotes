package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"time"

	"github.com/shashwtd/webnotes/database"
)

const API_URL = "http://localhost:8080/api/v1"
const FRONTEND_URL = "http://localhost:3000"

func doWorker(session_token string) error {
	slog.SetLogLoggerLevel(slog.LevelDebug)
	notes, err := extractNotes()
	if err != nil {
		return fmt.Errorf("extraction: %w", err)
	}
	slog.Info("extracted notes", "count", len(notes), "time", time.Now().Format(time.RFC3339))
	for _, note := range notes {
		slog.Info("note", "id", note.ID, "title", note.Title, "created", note.CreatedAt, "updated", note.UpdatedAt)
	}

	// write to DB
	err = writeDB(session_token, notes)
	if err != nil {
		return fmt.Errorf("writing to DB: %w", err)
	}
	slog.Info("notes written to DB", "count", len(notes), "time", time.Now().Format(time.RFC3339))

	return nil
}

func writeDB(session_token string, notes []database.Note) error {
	u, err := url.Parse(API_URL + "/notes/list")
	if err != nil {
		return fmt.Errorf("parsing URL: %w", err) // literally should never happen
	}
	body, err := json.Marshal(notes)
	if err != nil {
		return fmt.Errorf("marshalling notes: %w", err)
	}
	resp, err := http.DefaultClient.Do(&http.Request{
		Method: http.MethodPost,
		URL:    u,
		Header: http.Header{
			"Content-Type": {"application/json"},
			"Cookie":       []string{fmt.Sprintf("session_token=%s", session_token)},
		},
		Body: io.NopCloser(bytes.NewReader(body)),
	})
	if err != nil {
		return fmt.Errorf("post notes request: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusCreated { // leave on success
		return nil
	}
	type errorResponse struct {
		Error string `json:"error"`
	}
	var errResp errorResponse
	_ = json.NewDecoder(resp.Body).Decode(&errResp)

	return fmt.Errorf("unexpected status code: %d, error message: %s", resp.StatusCode, errResp.Error)
}
