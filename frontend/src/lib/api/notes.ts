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

/**
 * Lists all notes of the current user.
 *
 * @returns {Promise<Note[]>} A promise that resolves to an array of notes.
 * @throws {Error} If the fetch operation fails.
 */
export async function listNotes(): Promise<Note[]> {
    const response = await fetch(`${SERVER_URL}/notes/list`, {
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


/**
 * Fetches a specific note by its ID (requires authentication)
 * 
 * @param noteId The ID of the note to fetch.
 * @throws {Error} If the fetch operation fails.
 * @returns {Promise<Note>} A promise that resolves to the note object.
 */
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

/**
 * Deploys a note to make it publicly accessible.
 * 
 * @param noteId The ID of the note to deploy.
 * @throws {Error} If the deployment fails.
 * @returns {Promise<Note>} A promise that resolves to the deployed note object.
 */
export async function deployNote( noteId : string): Promise<Note> {
    const response = await fetch(`${SERVER_URL}/notes/deploy/${noteId}`, {
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

/**
 * Deletes a deployed note, making it no longer publicly accessible.
 * 
 * @param noteId The ID of the note to delete.
 * @throws {Error} If the deletion fails.
 * @return {Promise<void>} A promise that resolves when the note is deleted.
 */
export async function deleteDeployedNote(noteId: string): Promise<void> {
    const response = await fetch(`${SERVER_URL}/notes/deploy/${noteId}`, {
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

/**
 * Fetches a public note by username and slug.
 * 
 * @param username The username of the note's owner.
 * @param slug The slug of the note to fetch.
 * @returns {Promise<Note>} A promise that resolves to the public note object.
 * @throws {Error} If the fetch operation fails or the note is not found.
 */
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


/**
 * Fetches all *publicly available* notes of a user by username
 * 
 * @param username The username of the user whose notes to fetch.
 * @returns {Promise<Note[]>} A promise that resolves to an array of notes.
 * @throws {Error} If the fetch operation fails.
 */
export async function getAllNotes(username: string): Promise<Note[]> {
    const response = await fetch(`${SERVER_URL}/notes/list/${username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    const res = await response.json();
    return res;
}
