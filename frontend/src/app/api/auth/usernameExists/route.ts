import { NextResponse } from "next/server";

const SERVER_URL = process.env.SERVER_URL;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');

        if (!username) {
            return NextResponse.json(
                { error: "Username is required" },
                { status: 400 }
            );
        }

        // Check minimum length
        if (username.length < 4) {
            return NextResponse.json(
                { error: "Username must be at least 4 characters long", exists: undefined },
                { status: 400 }
            );
        }

        const response = await fetch(`${SERVER_URL}/accounts/usernameExists?username=${username}`);
        
        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to check username availability", exists: undefined },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Username existence check error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
