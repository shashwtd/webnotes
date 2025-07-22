
import { NextResponse } from "next/server";

const SERVER_URL = process.env.SERVER_URL;

export async function POST(request: Request) {
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

        return apiResponse;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
