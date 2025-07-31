"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function AuthorizeClientContent() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const redirectUri = searchParams.get("redirect_uri");

        if (!redirectUri) {
            setError("Missing redirect_uri parameter");
            return;
        }

        if (isLoading) return;

        if (!user) {
            const currentUrl = `/authorize-client?redirect_uri=${encodeURIComponent(
                redirectUri
            )}`;
            router.push(`/login?next=${encodeURIComponent(currentUrl)}`);
            return;
        }

        const getAuthCode = async () => {
            try {
                const { generateAuthCode } = await import('@/lib/api/auth');
                const { code } = await generateAuthCode();
                window.location.href = `${redirectUri}?code=${code}`;
            } catch (err) {
                console.error("Auth code error:", err);
                setError("Failed to generate authorization code");
            }
        };

        getAuthCode();
    }, [user, isLoading, router, searchParams]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <h2 className="font-semibold mb-2">Authorization Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
            <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                <p className="text-neutral-600">Authorizing client...</p>
            </div>
        </div>
    );
}

export default function AuthorizeClientPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                    <p className="text-neutral-600">Loading...</p>
                </div>
            </div>
        }>
            <AuthorizeClientContent />
        </Suspense>
    );
}
