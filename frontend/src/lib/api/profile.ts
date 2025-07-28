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
}

export interface PublishedNote {
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

export async function getPublishedNote(username: string, noteSlug: string): Promise<PublishedNote> {
    const response = await fetch(`${SERVER_URL}/notes/${username}/${noteSlug}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch published note');
    }

    return response.json();
}

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

    return response.json();
}

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

export async function removeProfilePicture(): Promise<void> {
    const response = await fetch(`${SERVER_URL}/profile/edit/profile-picture`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Failed to remove profile picture');
    }
}
