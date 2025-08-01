"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import AccountMenu from "@/components/dashboard/AccountMenu";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const router = useRouter();
    const { user, isLoading, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    // Only redirect if user is null and we've finished loading
    useEffect(() => {
        if (!isLoading && !user) {
            router.push(`/login?returnUrl=${encodeURIComponent(window.location.href)}`);
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-neutral-100">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                    <p className="text-neutral-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen w-full font-sans bg-neutral-100">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isMobile={isMobile}
            />

            {/* Main Content */}
            <main
                className={`min-h-screen transition-[padding] duration-300 ${
                    isSidebarOpen ? "lg:pl-72" : "pl-0"
                }`}
            >
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white border-b border-neutral-300">
                    <div className="px-6 py-2 flex items-center gap-4">
                        <button
                            onClick={() =>
                                setIsSidebarOpen(!isSidebarOpen)
                            }
                            className="text-neutral-500 hover:text-neutral-900 cursor-pointer"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Right Side - Account Menu */}
                        <div className="ml-auto">
                            <AccountMenu
                                user={user}
                                onLogout={handleLogout}
                            />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
