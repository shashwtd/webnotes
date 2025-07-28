const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

if (!SERVER_URL) {
    throw new Error("NEXT_PUBLIC_SERVER_URL environment variable is not set");
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
    deployed?: boolean;
    slug?: string;
    views?: number;
}

export interface PublishNoteParams {
    noteId: string;
    slug?: string;
    title?: string;
    description?: string;
}

export async function listNotes(): Promise<Note[]> {
    const response = await fetch(`${SERVER_URL}/notes`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch notes");
    }

    const fetchedNotes = await response.json();

    console.log("Fetched notes:", fetchedNotes);
    return fetchedNotes;
}

export async function getNote(noteId: string): Promise<Note> {
    const response = await fetch(`${SERVER_URL}/notes/${noteId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch note");
    }

    return response.json();
}

export async function deployNote( noteId : string): Promise<Note> {
    const response = await fetch(`${SERVER_URL}/notes/${noteId}/deploy`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to deploy note");
    }

    return response.json();
}

export async function deleteDeployedNote(noteId: string): Promise<void> {
    const response = await fetch(`${SERVER_URL}/notes/${noteId}/deploy`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to unpublish note");
    }
}

export async function getPublicNote(
    username: string,
    slug: string
): Promise<Note> {
    const response = await fetch(`${SERVER_URL}/notes/${username}/${slug}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    const res = await response.json();

    if (!response.ok) {
        throw new Error("Failed to fetch public note");
    }

    return res;
}

export async function getAllNotes(username: string): Promise<Note[]> {
    const response = await fetch(`${SERVER_URL}/notes/all/${username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    const res = await response.json();
    return res;
}
