package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"github.com/gofiber/fiber/v2"
)

const GITHUB_REPO = "shashwtd/webnotes"

func setBinaryGroup(router fiber.Router) {
	// /api/v1/binaries

	router.Get("/macos_client/latest", getLatestMacOSBinariesHandler()) // GET /api/v1/binaries/macos_client/latest (get the latest macOS client binaries)
}

type githubRelease struct {
	// this obv isn't the complete structure, just the fields we care about
	TagName string `json:"tag_name"`
	Assets  []struct {
		Name               string `json:"name"`
		BrowserDownloadURL string `json:"browser_download_url"`
	}
}

func getLatestMacOSBinariesHandler() fiber.Handler {
	u, err := url.Parse(fmt.Sprintf("https://api.github.com/repos/%s/releases/latest", GITHUB_REPO))
	if err != nil {
		panic(err) // unreachable
	}
	return func(c *fiber.Ctx) error {
		req := &http.Request{
			Method: "GET",
			URL:    u,
		}
		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			return sendError(c, err)
		}
		defer resp.Body.Close()
		var release githubRelease

		err = json.NewDecoder(resp.Body).Decode(&release)
		if err != nil {
			return sendError(c, err)
		}

		if release.TagName != "latest" || len(release.Assets) < 2 {
			return sendStringError(c, fiber.StatusNotFound, "improper release format")
		}

		var intelAssetURL, armAssetURL string
		for _, asset := range release.Assets {
			switch asset.Name {
			case "macos_client-darwin-amd64.zip":
				intelAssetURL = asset.BrowserDownloadURL
			case "macos_client-darwin-arm64.zip":
				armAssetURL = asset.BrowserDownloadURL
			}
		}
		if intelAssetURL == "" || armAssetURL == "" {
			return sendStringError(c, fiber.StatusNotFound, "missing required assets")
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": nil,
			"intel": intelAssetURL,
			"arm":   armAssetURL,
		})
	}
}
