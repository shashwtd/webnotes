import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SERVER_URL = process.env.SERVER_URL;

export async function middleware(request: NextRequest) {
    // Get session cookie
    const session = request.cookies.get("session");

    // If trying to access auth pages while logged in, redirect to dashboard
    if (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")) {
        if (session) {
            try {
                // Verify session with backend
                const response = await fetch(`${SERVER_URL}accounts/me`, {
                    headers: {
                        Cookie: `session=${session.value}`,
                    },
                });

                if (response.ok) {
                    return NextResponse.redirect(new URL("/dashboard", request.url));
                }
            } catch (error) {
                console.error("Auth check error:", error);
            }
        }
        return NextResponse.next();
    }

    // If trying to access protected routes without session, redirect to login
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
        if (!session) {
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.delete("session");
            return response;
        }

        try {
            // Verify session with backend
            const response = await fetch(`${SERVER_URL}accounts/me`, {
                headers: {
                    Cookie: `session=${session.value}`,
                },
            });

            if (!response.ok) {
                const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
                redirectResponse.cookies.delete("session");
                return redirectResponse;
            }
        } catch (error) {
            console.error("Auth check error:", error);
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.delete("session");
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
};
