
import { NextResponse } from "next/server";

const SERVER_URL = process.env.SERVER_URL;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch(`${SERVER_URL}/accounts/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "omit",
            body: JSON.stringify(body),
        });

        let data;
        try {
            data = await response.json();
        } catch (e) {
            console.error("Failed to parse response:", e);
            return NextResponse.json(
                { error: "Invalid server response" },
                { status: 500 }
            );
        }

        if (!response.ok) {
            return NextResponse.json(
                { error: data?.error || "Registration failed" },
                { status: response.status }
            );
        }

        const sessionCookie = response.headers.get("set-cookie");
        const successResponse = NextResponse.json({ error: null });
        
        if (sessionCookie) {
            successResponse.headers.set("Set-Cookie", sessionCookie);
        }

        return successResponse;
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
