package main

import (
	"bufio"
	"bytes"
	"fmt"
	"os/exec"
	"strings"

	"github.com/shashwtd/webnotes/database"
)

// helps and hints from the apple-notes-to-sqlite project (python):
// github.com/dogsheep/apple-notes-to-sqlite

// script returns an AppleScript that extracts notes from the Notes app.
func script(delim string) string {
	return fmt.Sprintf(`
tell application "Notes"
	repeat with eachNote in every note
		set noteContainer to container of eachNote
		set folderName to the name of noteContainer

		if folderName is not "Recently Deleted" then
			set noteId to the id of eachNote
			set noteTitle to the name of eachNote
			set noteBody to the body of eachNote
			set noteCreatedDate to the creation date of eachNote
			set noteCreated to (noteCreatedDate as «class isot» as string)
			set noteUpdatedDate to the modification date of eachNote
			set noteUpdated to (noteUpdatedDate as «class isot» as string)
			set noteFolderId to the id of noteContainer
			log "%s-id: " & noteId
			log "%s-created: " & noteCreated
			log "%s-updated: " & noteUpdated
			log "%s-folder: " & noteFolderId
			log "%s-title: " & noteTitle
			log noteBody
			log "%s%s"
		end if
	end repeat
end tell
`, delim, delim, delim, delim, delim, delim, delim)
}

// extractNotes runs the AppleScript and parses the output to extract notes.
func extractNotes() ([]database.Note, error) {
	delim := randomHex(8) // delim to separate fields in the output reliably
	s := script(delim)    // AppleScript to extract notes

	// run the script using osascript
	cmd := exec.Command("osascript", "-e", s)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("running AppleScript: %w", err)
	}

	// start parsin'
	scanner := bufio.NewScanner(bytes.NewReader(output))
	var notes []database.Note
	note := database.Note{}
	bodyLines := []string{}

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == delim+delim {
			if note.ID != "" {
				note.Body = strings.TrimSpace(strings.Join(bodyLines, "\n"))
				if note.Body == "" {
					// if body is empty, we're going to skip this note
					// empty notes are not useful but also it could mean that the note is locked
					continue
				}
				notes = append(notes, note)
			}
			note = database.Note{}
			bodyLines = []string{}
			continue
		}

		parsed := false
		for _, field := range []string{"id", "created", "updated", "folder", "title"} {
			prefix := fmt.Sprintf("%s-%s: ", delim, field)
			if strings.HasPrefix(line, prefix) {
				val := strings.TrimPrefix(line, prefix)
				switch field {
				case "id":
					note.ID = val
				case "created":
					note.CreatedAt = val
				case "updated":
					note.UpdatedAt = val
				case "title":
					note.Title = val
				}
				parsed = true
				break
			}
		}
		if !parsed {
			bodyLines = append(bodyLines, line)
		}
	}

	return notes, nil
}
