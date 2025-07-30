const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

if (!SERVER_URL) {
    throw new Error("NEXT_PUBLIC_SERVER_URL environment variable is not set");
}

export interface Activity {
    id: string;
    user_id: string;
    type: string;
    description: string;
    timestamp: string;
}

export interface ActivityResponse {
    activities: Activity[];
}

/**
 * Lists all activities of the current user.
 * 
 * @returns {Promise<Activity[]>} A promise that resolves to an array of activities.
 * @throws {Error} If the fetch operation fails.
 */
export async function listActivities(): Promise<Activity[]> {
    const response = await fetch(`${SERVER_URL}/activity`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch activities");
    }

    const data: ActivityResponse = await response.json();
    return data.activities;
}
