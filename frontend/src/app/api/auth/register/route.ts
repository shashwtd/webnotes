
import { NextResponse } from "next/server";
import { setCorsHeaders, corsMiddleware } from "@/lib/cors";

const SERVER_URL = process.env.SERVER_URL;

export async function POST(request: Request) {
    const corsCheck = await corsMiddleware(request);
    if (corsCheck) return corsCheck;
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

        return setCorsHeaders(successResponse);
    } catch (error) {
        console.error("Registration error:", error);
        return setCorsHeaders(
            NextResponse.json(
                { error: "Internal server error" },
                { status: 500 }
            )
        );
    }
}

export async function OPTIONS(request: Request) {
    return corsMiddleware(request);
}
