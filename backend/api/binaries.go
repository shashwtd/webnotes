package api

const GITHUB_REPO = "shashwtd/webnotes"

// func setBinaryGroup(router fiber.Router) {
// 	// /api/v1/binaries

// 	router.Get("/binaries/latest/macos_client/:arch", getLatestMacOSClientHandler())  // GET /api/v1/binaries/latest/macos_client/:arch (get the latest macOS client binary for a specific architecture)
// }

// func getLatestMacOSClientHandler() fiber.Handler {
// 	return func(c *fiber.Ctx) error {
// 		arch := c.Params("arch")
// 		if arch != "x64" && arch != "arm64" {
// 			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
// 				"error": "invalid architecture, must be 'x64' or 'arm64'",
// 			})
// 		}

// 		url := env.Default.GithubToken + "/repos/" + GITHUB_REPO + "/releases/latest"
// 		return c.Redirect(url, fiber.StatusFound)
// 	}
// }
