"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import AccountMenu from "@/components/dashboard/AccountMenu";

// Mock user data - this would come from your auth context
const mockUser = {
    name: "John Doe",
    email: "john@example.com",
};

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

    const handleLogout = () => {
        // Handle logout logic
        console.log("Logging out...");
    };

    return (
        <div className="min-h-screen w-full bg-neutral-50/50">
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
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-neutral-500 hover:text-neutral-900 cursor-pointer"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Right Side - Account Menu */}
                        <div className="ml-auto">
                            <AccountMenu user={mockUser} onLogout={handleLogout} />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
