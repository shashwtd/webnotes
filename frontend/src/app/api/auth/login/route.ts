
import { NextResponse } from "next/server";
import { setCorsHeaders, corsMiddleware } from "@/lib/cors";

const SERVER_URL = process.env.SERVER_URL;

export async function POST(request: Request) {
    const corsCheck = await corsMiddleware(request);
    if (corsCheck) return corsCheck;
    try {
        const body = await request.json();

        const response = await fetch(`${SERVER_URL}/accounts/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "omit",
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || "Login failed" },
                { status: response.status }
            );
        }

        const cookieHeader = response.headers.get("set-cookie");
        const apiResponse = NextResponse.json({ error: null });
        
        if (cookieHeader) {
            apiResponse.headers.set("Set-Cookie", cookieHeader);
        }

        return setCorsHeaders(apiResponse);
    } catch (error) {
        console.error("Login error:", error);
        return setCorsHeaders(
            NextResponse.json(
                { error: "Internal server error" },
                { status: 500 }
            )
        );
    }
}

export async function OPTIONS(request: Request) {
    const corsResponse = await corsMiddleware(request);
    return corsResponse || new Response(null, { status: 200 });
}
