const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

if (!SERVER_URL) {
    throw new Error('NEXT_PUBLIC_SERVER_URL environment variable is not set');
}

export async function updateDescription(description: string): Promise<void> {
    const response = await fetch(`${SERVER_URL}/profile/description`, {
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

    const response = await fetch(`${SERVER_URL}/profile/profile-picture`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to update profile picture');
    }
}

export async function removeProfilePicture(): Promise<void> {
    const response = await fetch(`${SERVER_URL}/profile/profile-picture`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Failed to remove profile picture');
    }
}
