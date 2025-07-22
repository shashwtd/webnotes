import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SERVER_URL = process.env.SERVER_URL;

export async function POST() {
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

        return res;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Failed to logout" },
            { status: 500 }
        );
    }
}
