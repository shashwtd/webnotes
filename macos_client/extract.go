package main

import (
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
		fmt.Println("output of applescript")
		fmt.Println(string(output))
		return nil, fmt.Errorf("running AppleScript: %w", err)
	}

	lines := strings.Split(string(output), "\n")
	var notes []database.Note

	var note database.Note
	var inNote bool
	var bodyLines []string

	for _, line := range lines {
		line = strings.TrimSpace(line)

		switch {
		case strings.HasPrefix(line, delim+"-id: "):
			note = database.Note{
				Source: "apple-notes",
			}
			bodyLines = nil
			inNote = true
			note.SourceIdentifier = strings.TrimPrefix(line, delim+"-id: ")

		case strings.HasPrefix(line, delim+"-created: "):
			note.CreatedAt = strings.TrimPrefix(line, delim+"-created: ")

		case strings.HasPrefix(line, delim+"-updated: "):
			note.UpdatedAt = strings.TrimPrefix(line, delim+"-updated: ")

		case strings.HasPrefix(line, delim+"-title: "):
			note.Title = strings.TrimPrefix(line, delim+"-title: ")
		case strings.HasPrefix(line, delim+"-folder: "):
			// uhhh
		case line == delim+delim:
			// End of one note
			note.Body = strings.Join(bodyLines, "\n")
			notes = append(notes, note)
			inNote = false

		default:
			if inNote {
				// This is part of the body
				bodyLines = append(bodyLines, line)
			}
		}
	}

	return notes, nil
}
