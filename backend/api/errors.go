package api

import (
	"strings"

	"github.com/gofiber/fiber/v2"
)

func sendError(c *fiber.Ctx, err error) error {
	if err == nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": nil,
		})
	}
	errMessage := err.Error()
	newErrorMessage := "an error occurred, please try again later"
	var statusCode int = fiber.StatusInternalServerError

	if strings.Contains(errMessage, "duplicate key value violates unique constraint") {
		statusCode = fiber.StatusConflict
		if strings.Contains(errMessage, "users_email_key") {
			newErrorMessage = "email already exists, use a different email or log in"
		}
		if strings.Contains(errMessage, "users_username_key") {
			newErrorMessage = "username already in use, use a different username or log in"
		}
	}
	if strings.Contains(errMessage, "invalid input syntax for type uuid") {
		statusCode = fiber.StatusUnprocessableEntity
		newErrorMessage = "the id passed is invalid"
	}
	if strings.Contains(errMessage, "no rows in result set") || strings.Contains(errMessage, "multiple (or no) rows returned") {
		statusCode = fiber.StatusNotFound
		newErrorMessage = "the requested resource was not found"
	}
	return c.Status(statusCode).JSON(fiber.Map{
		"error": newErrorMessage,
	})
}

func sendStringError(c *fiber.Ctx, status int, err string) error {
	return c.Status(status).JSON(fiber.Map{
		"error": err,
	})
}
