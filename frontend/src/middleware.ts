import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SERVER_URL = process.env.SERVER_URL;
const COOKIE_NAME = "session_token";

export async function middleware(request: NextRequest) {
    const session = request.cookies.get(COOKIE_NAME);

    if (
        request.nextUrl.pathname.startsWith("/login") ||
        request.nextUrl.pathname.startsWith("/register")
    ) {
        if (session) {
            try {
                const response = await fetch(`${SERVER_URL}/accounts/me`, {
                    headers: {
                        Cookie: `${COOKIE_NAME}=${session.value}`,
                    },
                    credentials: "include",
                });

                if (response.ok) {
                    return NextResponse.redirect(
                        new URL("/dashboard", request.url)
                    );
                }
            } catch (error) {
                console.error("Auth check error:", error);
            }
        }
        return NextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith("/dashboard")) {
        if (!session) {
            const response = NextResponse.redirect(
                new URL("/login", request.url)
            );
            response.cookies.delete(COOKIE_NAME);
            return response;
        }
        try {
            const response = await fetch(`${SERVER_URL}/accounts/me`, {
                headers: {
                    Cookie: `${COOKIE_NAME}=${session.value}`,
                },
                credentials: "include",
            });

            if (!response.ok) {
                const redirectResponse = NextResponse.redirect(
                    new URL("/login", request.url)
                );
                redirectResponse.cookies.delete(COOKIE_NAME);
                return redirectResponse;
            }
        } catch (error) {
            console.error("Auth check error:", error);
            const response = NextResponse.redirect(
                new URL("/login", request.url)
            );
            response.cookies.delete(COOKIE_NAME);
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
};
