import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SERVER_URL = process.env.SERVER_URL;
const COOKIE_NAME = "session_token";

// Helper function to extract subdomain from hostname
function getSubdomain(hostname: string): string | null {
    // Remove port if present (mostly for dev environments)
    const host = hostname.split(':')[0];
    const parts = host.split('.');
    
    // For localhost development, check if it's in format like user.localhost
    if (host.includes('localhost') && parts.length > 1) {
        return parts[0] !== 'localhost' ? parts[0] : null;
    }
    
    // For localhost development without subdomain
    if (host === 'localhost' || host.includes('127.0.0.1')) {
        return null;
    }
    
    // For production domain.app, we expect: subdomain.domain.app
    if (parts.length >= 3) {
        return parts[0];
    }
    
    return null;
}

// Helper function to handle subdomain requests
async function handleSubdomainRequest(request: NextRequest, username: string) {
    const pathname = request.nextUrl.pathname;
    
    // Check if this is a note request (has additional path)
    if (pathname !== '/') {
        // Extract note slug from pathname (remove leading slash)
        const noteSlug = pathname.substring(1);
        
        // Rewrite to internal route for note rendering
        const url = request.nextUrl.clone();
        url.pathname = `/profile/${username}/note/${noteSlug}`;
        return NextResponse.rewrite(url);
    }
    
    // This is a profile page request
    const url = request.nextUrl.clone();
    url.pathname = `/profile/${username}`;
    return NextResponse.rewrite(url);
}

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get("host") || "";
    
    // Extract subdomain from hostname
    const subdomain = getSubdomain(hostname);
    
    // If we have a subdomain (user profile request)
    if (subdomain && subdomain !== "www") {
        return handleSubdomainRequest(request, subdomain);
    }
    
    // Regular middleware logic for main domain
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
                    console.log(await response.json())
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

            // Only redirect on 401 Unauthorized
            if (response.status === 401) {
                const redirectResponse = NextResponse.redirect(
                    new URL("/login", request.url)
                );
                redirectResponse.cookies.delete(COOKIE_NAME);
                return redirectResponse;
            }
            
            // For network errors or other response codes, allow the request
            return NextResponse.next();
        } catch (error) {
            // For network errors, allow the request to continue
            console.error("Auth check error:", error);
            return NextResponse.next();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Handle dashboard and auth routes
        "/dashboard/:path*", 
        "/login", 
        "/register", 
        "/authorize-client",
        // Handle all subdomain requests
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
