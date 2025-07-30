package database

import (
	"fmt"
	"time"

	"github.com/supabase-community/postgrest-go"
)

func (db *DB) GetActivities(userID string, loadTime time.Time, offset, limit int) ([]Activity, error) {
	var activities []Activity

	// build the query
	query := db.client.From("activities").Select("*", "", false).Eq("user_id", userID).Order("timestamp", &postgrest.OrderOpts{
		Ascending: false,
	}).Range(offset, max(offset+limit-1, 0), "")
	// add timestamp filter if loadTime is set
	if loadTime.UnixMilli() > 0 {
		fmt.Println("ns. usar")
		query = query.Lt("timestamp", loadTime.Format(time.RFC3339))
	}

	// execute the query
	_, err := query.ExecuteTo(&activities)
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
