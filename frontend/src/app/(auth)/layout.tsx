"use client";

import Header from "@/components/Header";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header bg="bg-neutral-50" isAuthPage />
            <main className="min-h-screen w-full bg-neutral-50 font-sans flex flex-col items-center pt-24 p-6 relative overflow-hidden">
                {/* Auth Form Container */}
                <div className="w-full max-w-md flex flex-col gap-4">
                    {/* Back Link */}
                    <Link
                        href="/"
                        className="group w-full max-w-md flex pl-2 gap-2 items-center justify-start text-neutral-600 hover:text-neutral-900"
                    >
                        <ArrowRight
                            size={14}
                            className="mr-1 rotate-180  transition-transform"
                        />
                        Return to homepage
                    </Link>

                    {/* The form element */}
                    <div className="bg-white border border-black/20 backdrop-blur-xl rounded-2xl p-8 shadow-xl shadow-neutral-200/40">
                        {children}
                    </div>
                </div>
            </main>
        </>
    );
}
