import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { setCorsHeaders, corsMiddleware } from "@/lib/cors";

const SERVER_URL = process.env.SERVER_URL;

export async function POST(request: Request) {
    const corsCheck = await corsMiddleware(request);
    if (corsCheck) return corsCheck;
    try {
        const response = await fetch(`${SERVER_URL}/accounts/logout`, {
            method: "GET",
            headers: {
                Cookie: `session_token=${(await cookies()).get("session_token")?.value || ""}`,
            },
        });

        if (!response.ok) {
            throw new Error("Logout failed");
        }

        const res = NextResponse.json({ error: null });
        res.cookies.delete("session_token");

        return setCorsHeaders(res);
    } catch (error) {
        console.error("Logout error:", error);
        return setCorsHeaders(
            NextResponse.json(
                { error: "Failed to logout" },
                { status: 500 }
            )
        );
    }
}

export async function OPTIONS(request: Request) {
    const corsResponse = await corsMiddleware(request);
    return corsResponse || new Response(null, { status: 200 });
}
