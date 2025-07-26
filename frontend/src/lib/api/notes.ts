const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

if (!SERVER_URL) {
    throw new Error('NEXT_PUBLIC_SERVER_URL environment variable is not set');
}

export interface Note {
    id: string;
    source: string;
    source_identifier: string;
    created_at: string;
    updated_at: string;
    title: string;
    body: string;
    user_id: string;
    inserted_at: string;
}

export async function listNotes(): Promise<Note[]> {
    const response = await fetch(`${SERVER_URL}/notes/list`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch notes');
    }

    const fetchedNotes = await response.json();

    console.log('Fetched notes:', fetchedNotes);
    return fetchedNotes;
}

export async function getNote(noteId: string): Promise<Note> {
    const response = await fetch(`${SERVER_URL}/notes/${noteId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch note');
    }

    return response.json();
}
