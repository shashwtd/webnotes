const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

if (!SERVER_URL) {
    throw new Error("NEXT_PUBLIC_SERVER_URL environment variable is not set");
}

export interface User {
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
}

export interface RegisterData {
    email: string;
    username: string;
    name: string;
    password: string;
}

/**
 * Checks if a username already exists in the system.
 *
 * @param username The username to check
 * @returns {Promise<{exists: boolean}>} A promise that resolves to an object indicating if the username exists
 * @throws {Error} If the username check fails
 */
export async function checkUsernameExists(username: string): Promise<{ exists: boolean }> {
    if (!username) {
        throw new Error("Username is required");
    }

    // Check minimum length
    if (username.length < 4) {
        throw new Error("Username must be at least 4 characters long");
    }

    const response = await fetch(`${SERVER_URL}/accounts/usernameExists?username=${encodeURIComponent(username)}`);

    if (!response.ok) {
        throw new Error("Failed to check username availability");
    }

    return response.json();
}

/**
 * Logs in a user with username/email and password.
 *
 * @param usernameOrEmail The username or email of the user
 * @param password The user's password
 * @returns {Promise<void>} A promise that resolves when login is successful
 * @throws {Error} If login fails
 */
export async function login(usernameOrEmail: string, password: string): Promise<void> {
    const response = await fetch(`${SERVER_URL}/accounts/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            [usernameOrEmail.includes("@") ? "email" : "username"]: usernameOrEmail,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Login failed");
    }
}

/**
 * Registers a new user.
 *
 * @param data The registration data including email, username, name, and password
 * @returns {Promise<void>} A promise that resolves when registration is successful
 * @throws {Error} If registration fails
 */
export async function register(data: RegisterData): Promise<void> {
    const response = await fetch(`${SERVER_URL}/accounts/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || "Registration failed");
    }
}

/**
 * Gets the currently authenticated user's information.
 *
 * @returns {Promise<User>} A promise that resolves to the user object
 * @throws {Error} If not authenticated or if the request fails
 */
export async function getCurrentUser(): Promise<User> {
    try {
        const response = await fetch(`${SERVER_URL}/accounts/me`, {
            credentials: "include",
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Unauthorized");
            }
            throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        return userData;
    } catch (error) {
        throw error;
    }
}

/**
 * Logs out the currently authenticated user.
 *
 * @returns {Promise<void>} A promise that resolves when logout is successful
 * @throws {Error} If logout fails
 */
export async function logout(): Promise<void> {
    try {
        const response = await fetch(`${SERVER_URL}/accounts/logout`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Logout failed");
        }
    } finally {
    }
}

/**
 * Generates an authorization code for the currently authenticated user.
 *
 * @returns {Promise<{code: string}>} A promise that resolves to an object containing the authorization code
 * @throws {Error} If not authenticated or if code generation fails
 */
export async function generateAuthCode(): Promise<{ code: string }> {
    const response = await fetch(`${SERVER_URL}/accounts/authcode`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Unauthorized");
        }
        throw new Error("Failed to generate auth code");
    }

    return response.json();
}