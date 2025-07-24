import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { setCorsHeaders, corsMiddleware } from "@/lib/cors";

const SERVER_URL = process.env.SERVER_URL;

export async function GET(request: Request) {
    const corsCheck = await corsMiddleware(request);
    if (corsCheck) return corsCheck;
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore
            .getAll()
            .find((c) => c.name === "session_token");

        if (!sessionCookie) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const response = await fetch(`${SERVER_URL}/accounts/me`, {
            headers: {
                Cookie: `session_token=${sessionCookie.value}`,
            },
            credentials: "omit",
        });

        if (!response.ok) {
            if (response.status === 401) {
                return NextResponse.json(
                    { error: "Unauthorized" },
                    { status: 401 }
                );
            }
            throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        return setCorsHeaders(NextResponse.json(data));
    } catch (error) {
        console.error("Get user error:", error);
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
