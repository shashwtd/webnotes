package database

import (
	"fmt"

	"github.com/supabase-community/postgrest-go"
)

func (db *DB) GetActivities(userID string) ([]Activity, error) {
	var activities []Activity
	_, err := db.client.From("activities").Select("*", "", false).Eq("user_id", userID).Order("timestamp", &postgrest.OrderOpts{
		Ascending: false,
	}).ExecuteTo(&activities)
	if err != nil {
		return nil, fmt.Errorf("get user activities: %w", err)
	}
	return activities, nil
}

func (db *DB) GetLastActivityByType(userID, activityType string) (*Activity, error) {
	var activity Activity
	_, err := db.client.From("activities").Select("*", "", false).Eq("user_id", userID).Eq("type", activityType).Order("timestamp", &postgrest.OrderOpts{
		Ascending: false,
	}).Limit(1, "").Single().ExecuteTo(&activity)
	if err != nil {
		return nil, fmt.Errorf("get last activity by type: %w", err)
	}
	return &activity, nil
}

func (db *DB) InsertActivity(activity *Activity) error {
	_, err := db.client.From("activities").Insert(activity, false, "", "", "").Single().ExecuteTo(activity)
	if err != nil {
		return fmt.Errorf("insert activity: %w", err)
	}
	return nil
}
