"use client";

import { Activity } from "@/lib/api/activity";
import { ActivityItem } from "./ActivityItem";

interface ActivityFeedProps {
    activities: Activity[];
    limit?: number;
}

export function ActivityFeed({ activities, limit }: ActivityFeedProps) {
    const displayActivities = limit ? activities.slice(0, limit) : activities;

    if (activities.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center py-16 opacity-50">
                No recent activity
            </div>
        );
    }

    return (
        <div className="divide-y divide-neutral-200">
            {displayActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
            ))}
        </div>
    );
}
