import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export type CorsRequest = Request | NextRequest;

export function setCorsHeaders(response: NextResponse) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
    response.headers.set(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
    return response;
}

export async function corsMiddleware(request: CorsRequest): Promise<NextResponse | null> {
    if (request.method === 'OPTIONS') {
        return setCorsHeaders(new NextResponse(null, { status: 200 }));
    }
    return null;
}
