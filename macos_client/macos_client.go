package main

import (
	"flag"
	"fmt"
	"log/slog"
	"os"
	"time"
)

var isWorker bool

func init() {
	flag.BoolVar(&isWorker, "worker", false, "Run as a worker") // this is for the cron job invocation
	flag.Parse()
}

func main() {
	var err error
	if isWorker {
		err = runWorker()
	} else {
		err = createJob()
	}
	if err != nil {
		slog.Error("error occurred", "error", err, "time", time.Now().Format(time.RFC3339))
		os.Exit(1)
	}
	slog.Info("operation completed successfully", "time", time.Now().Format(time.RFC3339))
}

func runWorker() error {
	doWorker()
	for range time.Tick(time.Second * 250) {
		err := doWorker()
		if err != nil {
			slog.Error("worker error", "error", err, "time", time.Now().Format(time.RFC3339))
		}
	}
	return nil
}

func doWorker() error {
	notes, err := extractNotes()
	if err != nil {
		return fmt.Errorf("extraction: %w", err)
	}
	slog.Info("extracted notes", "count", len(notes), "time", time.Now().Format(time.RFC3339))
	for _, note := range notes {
		slog.Info("note", "id", note.ID, "title", note.Title, "created", note.Created, "updated", note.Updated)
	}
	return nil
}
