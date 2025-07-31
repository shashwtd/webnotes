const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

if (!SERVER_URL) {
    throw new Error("NEXT_PUBLIC_SERVER_URL environment variable is not set");
}

export interface StatisticsInterface {
    totalViews: number;
    totalNotes: number;
    deployedNotes: number;
}

/**
 * Fetches user stats such as total views, total notes, and deployed notes.
 * 
 * @returns {Promise<StatisticsInterface>} A promise that resolves to an object containing user statistics. 
 * @throws {Error} If the fetch operation fails.
 */
export async function getMyStats(): Promise<StatisticsInterface> {
    const response = await fetch(`${SERVER_URL}/statistics`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user statistics");
    }

    return await response.json();
}
