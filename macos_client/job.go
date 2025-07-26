package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/zalando/go-keyring"
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

func initializeService() error {
	// get an long-lived session token
	err := getLongLivedSessionToken()

	// create job
	err = createJob()
	if err != nil {
		return fmt.Errorf("creating job: %w", err)
	}

	// doWorker(getSessionTokenFromKR()) // will ask for permissions to run the AppleScript

	return nil
}

func getLongLivedSessionToken() error {
	listener, err := net.Listen("tcp", ":0")
	if err != nil {
		return fmt.Errorf("starting listener: %w", err)
	}
	defer listener.Close()
	port := listener.Addr().(*net.TCPAddr).Port

	ctx, cancel := context.WithCancel(context.Background())
	srv := &http.Server{
		Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Method != http.MethodGet {
				http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
				return
			}
			code := r.URL.Query().Get("code")
			if code == "" {
				http.Error(w, "missing code query parameter", http.StatusBadRequest)
				return
			}
			// exchange the code for a session token
			sessionToken, err := exchangeAuthCode(code)
			if err != nil {
				http.Error(w, fmt.Sprintf("failed to exchange auth code: %v", err), http.StatusInternalServerError)
				return
			}
			// store the session token in keyring
			err = keyring.Set("webnotes", "session_token", sessionToken)
			if err != nil {
				http.Error(w, fmt.Sprintf("failed to store session token: %v", err), http.StatusInternalServerError)
				return
			}
			cancel() // stop the server
			fmt.Fprintf(w, "Session token stored successfully. You can close this window.")
		}),
	}
	go srv.Serve(listener) // start the server in a goroutine

	url := fmt.Sprintf("%s/authorize-client?redirect_uri=%s", FRONTEND_URL, url.QueryEscape(fmt.Sprintf("http://127.0.0.1:%d", port)))
	fmt.Printf("Please open the following URL in your browser to authorize the client:\n%s\n", url)

	<-ctx.Done()
	srv.Shutdown(context.Background()) // shut down the server gracefully
	fmt.Println("Authorization complete.")
	return nil
}

func exchangeAuthCode(code string) (string, error) {
	u, err := url.Parse(API_URL + "/accounts/exchangeAuthCode")
	if err != nil {
		return "", fmt.Errorf("parsing URL: %w", err)
	}

	b, _ := json.Marshal(map[string]string{"code": code})
	resp, err := http.DefaultClient.Do(&http.Request{
		Method: http.MethodPost,
		URL:    u,
		Header: http.Header{
			"Content-Type": {"application/json"},
		},
		Body: io.NopCloser(bytes.NewReader(b)),
	})
	if err != nil {
		return "", fmt.Errorf("post exchange auth code request: %w", err)
	}
	defer resp.Body.Close()
	type response struct {
		SessionToken string `json:"session_token"`
		Error        string `json:"error"`
	}
	var respBody response
	err = json.NewDecoder(resp.Body).Decode(&respBody)
	if err != nil {
		return "", fmt.Errorf("decoding response: %w", err)
	}
	if resp.StatusCode != http.StatusOK || respBody.Error != "" {
		return "", fmt.Errorf("exchange auth code failed with status: %s, err: %s", resp.Status, respBody.Error)
	}
	return respBody.SessionToken, nil
}

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
