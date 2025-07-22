package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" 
"http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.webnotes.client</string>

    <key>ProgramArguments</key>
    <array>
        <string>%s</string>
        <string>--worker</string>
    </array>

    <key>RunAtLoad</key>
    <true/>

    <key>KeepAlive</key>
    <true/>

    <key>StandardOutPath</key>
    <string>/tmp/webnotes.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/webnotes.err</string>
</dict>
</plist>
`

func createJob() error {
	// plist content
	pathToExecutable, err := os.Executable()
	if err != nil {
		return fmt.Errorf("unable to get executable path: %w", err)
	}

	plistContent := fmt.Sprintf(plist, pathToExecutable)

	// plist path
	home, _ := os.UserHomeDir()
	if home == "" {
		home = "~" // last shot fallback
	}
	plistPath := filepath.Join(home, "Library/LaunchAgents/com.webnotes.client.plist")

	// plist file
	err = os.WriteFile(plistPath, []byte(plistContent), 0644)
	if err != nil {
		return fmt.Errorf("unable to create plist file: %w", err)
	}

	// unload if its already there
	exec.Command("launchctl", "unload", plistPath).Run() // ignore errors
	// load
	output, err := exec.Command("launchctl", "load", plistPath).CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to load launchctl job: %w, output: %s", err, output)
	}
	return nil
}
