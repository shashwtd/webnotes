package main

import (
	"flag"
	"log/slog"
	"os"
	"time"

	"github.com/zalando/go-keyring"
)

var isWorker bool
var isFakeWorker bool

func init() {
	flag.BoolVar(&isWorker, "worker", false, "Run as a worker") // this is for the cron job invocation
	flag.BoolVar(&isFakeWorker, "worker-fake", false, "Run as a fake worker (for testing purposes)")
	flag.Parse()
}

func main() {
	var err error
	if isWorker {
		err = runWorker(getSessionTokenFromKR())
	} else if isFakeWorker {
		err = doWorker(getSessionTokenFromKR())
	} else {
		err = initializeService()
	}
	if err != nil {
		slog.Error("error occurred", "error", err, "time", time.Now().Format(time.RFC3339))
		os.Exit(1)
	}
	slog.Info("operation completed successfully", "time", time.Now().Format(time.RFC3339))
}

func getSessionTokenFromKR() string {
	token, err := keyring.Get("webnotes", "session_token")
	if err != nil {
		slog.Error("get token from keyring", "error", err, "time", time.Now().Format(time.RFC3339))
		os.Exit(1)
	}
	return token
}

func runWorker(session_token string) error {
	slog.SetLogLoggerLevel(slog.LevelDebug)
	doWorker(session_token) // will ask for permissions to run the AppleScript
	for range time.Tick(time.Second * 5) {
		err := doWorker(session_token)
		if err != nil {
			slog.Error("worker error", "error", err, "time", time.Now().Format(time.RFC3339))
		}
	}
	return nil
}
