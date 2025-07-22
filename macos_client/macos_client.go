package main

import (
	"flag"
	"log/slog"
	"os"
	"time"
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
		err = runWorker()
	} else if isFakeWorker {
		err = doWorker()
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
	doWorker() // will ask for permissions to run the AppleScript
	for range time.Tick(time.Second * 250) {
		err := doWorker()
		if err != nil {
			slog.Error("worker error", "error", err, "time", time.Now().Format(time.RFC3339))
		}
	}
	return nil
}
