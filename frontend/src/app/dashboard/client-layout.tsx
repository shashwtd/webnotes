"use client";

import { useEffect, useState } from "react";
import { LucideBookOpen, LucideTriangleAlert, LucideX, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import AccountMenu from "@/components/dashboard/AccountMenu";
import { useAuth } from "@/context/AuthContext";
import classNames from "classnames";

export default function DashboardClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [showMacOsClientWarn, setMacOsClientWarn] = useState(false);

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
            router.push(
                `/login?returnUrl=${encodeURIComponent(window.location.href)}`
            );
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        console.log("User:", user);
        if (user && !user.has_connected_client) {
            setMacOsClientWarn(true);
        }
    }, [user]);

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
        <div className="min-h-screen relative w-full font-sans bg-neutral-100">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isMobile={isMobile}
            />

            {showMacOsClientWarn && (
                <div
                    className={classNames(
                        "w-screen h-screen flex items-center justify-center z-50 fixed top-0 left-0 bg-black/20 backdrop-blur-[2px]",
                        {}
                    )}
                >
                    <div className="w-full max-w-xl bg-white h-max duration-500 p-8 rounded-xl shadow-2xl z-50 relative">
                        <div
                            className="absolute right-2 top-2 text-black cursor-pointer p-2"
                            onClick={() => {
                                setMacOsClientWarn(false);
                            }}
                        >
                            <LucideX
                                size={22}
                                className="opacity-50 hover:opacity-80 duraiton-200 hover:scale-105"
                            />
                        </div>
                        <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-3 w-max">
                            <LucideTriangleAlert
                                size={24}
                                className="inline-block text-yellow-600"
                            />
                            MacOS Client Not Connected
                        </h2>
                        <p className="text-black/75 mb-6">
                            Your account needs to be connected to the MacOS client to sync and deploy notes. Please follow the guide below to set it up. 
                        </p>
                        <div className="flex gap-2 items-center justify-center w-max">
                            <Link
                                href="/user-guide"
                                className="bg-blue-600 flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <LucideBookOpen size={18} />
                                Visit User Guide
                            </Link>
                            <button
                                onClick={() => setMacOsClientWarn(false)}
                                className="bg-neutral-300 text-black/80 px-4 py-2 rounded-lg hover:bg-neutral-400/60 transition-colors"
                            >
                                I&apos;ll do it later
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main
                className={`min-h-screen transition-[padding] duration-300 ${
                    isSidebarOpen ? "lg:pl-72" : "pl-0"
                }`}
            >
                <header className="sticky top-0 z-10 bg-white border-b border-neutral-300">
                    <div className="px-6 py-2 flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-neutral-500 hover:text-neutral-900 cursor-pointer"
                        >
                            <Menu size={20} />
                        </button>

                        <div className="ml-auto">
                            <AccountMenu user={user} onLogout={handleLogout} />
                        </div>
                    </div>
                </header>

                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
