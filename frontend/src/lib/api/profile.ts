const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

if (!SERVER_URL) {
    throw new Error('NEXT_PUBLIC_SERVER_URL environment variable is not set');
}

export interface UserProfile {
    id: string;
    email: string;
    username: string;
    name: string;
    description: string;
    profile_picture_url: string;
    created_at: string;
    twitter_username?: string;
    instagram_username?: string;
    github_username?: string;
    views_count: number;
    notes_count: number;
}

export interface DeployedNote {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    author: {
        username: string;
        name: string;
        profile_picture_url: string;
    };
}

/**
 * Fetches a user profile by username.
 * 
 * @param username The username of the user whose profile to fetch.
 * @returns {Promise<UserProfile>} A promise that resolves to the user's profile.
 * @throws {Error} If the fetch operation fails or the user is not found.
 */
export async function getUserProfile(username: string): Promise<UserProfile> {
    const response = await fetch(`${SERVER_URL}/profile/${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }

    const a=  await response.json();
    console.log(a);
    return a
}

/**
 * Updates the user's description (requires authentication)
 * 
 * @param description The new description to set for the user profile.
 * @returns {Promise<void>} A promise that resolves when the description is updated.
 * @throws {Error} If the update operation fails.
 */
export async function updateDescription(description: string): Promise<void> {
    const response = await fetch(`${SERVER_URL}/profile/edit/description`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ description })
    });

    if (!response.ok) {
        throw new Error('Failed to update description');
    }
}

/**
 * Updates the user's profile picture (requires binary data in FormData format)
 * 
 * @param file ]The new profile picture file to upload.
 * @returns {Promise<void>} A promise that resolves when the profile picture is updated.
 * @throws {Error} If the update operation fails.
 */
export async function updateProfilePicture(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await fetch(`${SERVER_URL}/profile/edit/profile-picture`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to update profile picture');
    }
}

/**
 * Removes the curent user's profile picture 
 * 
 * @returns {Promise<void>} A promise that resolves when the profile picture is removed.
 * @throws {Error} If the removal operation fails.
 */
export async function removeProfilePicture(): Promise<void> {
    const response = await fetch(`${SERVER_URL}/profile/edit/profile-picture`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Failed to remove profile picture');
    }
}

/**
 * Updates the user's social media links
 * 
 * @param socials Object containing social media usernames
 * @returns {Promise<void>} A promise that resolves when the socials are updated.
 * @throws {Error} If the update operation fails.
 */
export async function updateSocials(socials: {
    twitter_username?: string;
    instagram_username?: string;
    github_username?: string;
}): Promise<void> {
    const response = await fetch(`${SERVER_URL}/profile/edit/socials`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(socials)
    });

    if (!response.ok) {
        throw new Error('Failed to update social links');
    }
}
