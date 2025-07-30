"use client";

import { useEffect, useState } from "react";
import { Activity, listActivities } from "@/lib/api/activity";
import { ActivityFeed } from "@/components/activity/ActivityFeed";

export default function ActivityPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const activitiesList = await listActivities();
                setActivities(activitiesList);
            } catch (error) {
                console.error('Failed to fetch activities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto p-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-neutral-100 rounded-lg w-1/3"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-neutral-100 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Activity Log
                </h1>
                <p className="text-neutral-500 mt-1">
                    Track all your actions and changes in one place.
                </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <ActivityFeed activities={activities} />
            </div>
        </div>
    );
}
