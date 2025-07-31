const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

if (!SERVER_URL) {
    throw new Error("NEXT_PUBLIC_SERVER_URL environment variable is not set");
}

export interface MacOSBinaries {
    error: string | null;
    intel?: string;
    arm?: string;
}

/**
 * Fetches the download links for the latest MacOS client binaries.
 * 
 * @returns {Promise<MacOSBinaries>} A promise that resolves all the download links for the latest MacOS client binaries.
 * @throws {Error} If the fetch operation fails.
 */
export async function getBinaryLinks(): Promise<MacOSBinaries> {
    const response = await fetch(`${SERVER_URL}/binaries/macos_client/latest`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch download links");
    }

    return await response.json();
}
