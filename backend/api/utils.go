package api

import "github.com/gofiber/fiber/v2"

func handler[T any](f func(c *fiber.Ctx, body T) error) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var body T
		if err := c.BodyParser(&body); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "parse request body for this request failed",
			})
		}
		return f(c, body)
	}
}
