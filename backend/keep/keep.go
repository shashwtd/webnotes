package keep

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/ajiteshkumar/webnotes/backend/env"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/keep/v1"
	"google.golang.org/api/option"
)

var config *oauth2.Config

func Init() {
	// fmt.Println("18", env.Default.GoogleOAuthClientID, env.Default.GoogleOAuthClientSecret)
	config = &oauth2.Config{
		ClientID:     env.Default.GoogleOAuthClientID,
		ClientSecret: env.Default.GoogleOAuthClientSecret,
		RedirectURL:  "http://localhost:8080/api/keep/redirect",
		Scopes:       []string{keep.KeepReadonlyScope},
		Endpoint:     google.Endpoint,
	}
}

func RedirectURL() string {
	return config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
}

type Service struct {
	service *keep.Service // services are user-specific
}

func (s *Service) GetNotes(ctx context.Context) ([]*keep.Note, error) {
	notes, err := s.service.Notes.List().Do()
	if err != nil {
		slog.Error("failed to list notes", "error", err)
		return nil, fmt.Errorf("failed to list notes: %w", err)
	}
	return notes.Notes, nil
}

func RecieveCode(ctx context.Context, code string) (*Service, error) {
	token, err := config.Exchange(ctx, code)
	if err != nil {
		return nil, fmt.Errorf("exchange failed: %w", err)
	}

	client := config.Client(ctx, token)
	service, err := keep.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		slog.Error("failed to create keep service", "error", err)
		return nil, err
	}

	return &Service{service: service}, nil
}
