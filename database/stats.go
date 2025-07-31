package database

import "fmt"

func (db *DB) GetUserStats(userID string) (string, error) {
	data := db.client.Rpc("get_user_stats", "", map[string]any{
		"uid": userID,
	})
	if len(data) == 0 {
		return "", fmt.Errorf("no stats found for user ID: %s", userID)
	}
	return data[1 : len(data)-1], nil // we either make it or we corrupt data :)
}
