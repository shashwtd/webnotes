"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    X,
    Settings,
    Layout,
    Clock,
    Laptop,
    ChevronRight,
    RotateCw,
    Rocket,
    Globe,
    BookOpen,
} from "lucide-react";
import { DeployNotePopup } from "@/components/notes/DeployNotePopup";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedText from "@/components/AnimatedText";

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
    isNew?: boolean;
}

const navigation: NavItem[] = [
    {
        label: "Overview",
        href: "/dashboard",
        icon: Layout,
    },
    {
        label: "Deployed Notes",
        href: "/dashboard/notes",
        icon: Globe,
    },
    {
        label: "Recent Activity",
        href: "/dashboard/activity",
        icon: Clock,
    },
    {
        label: "Mac Client",
        href: "/dashboard/client",
        icon: Laptop,
        isNew: true,
    },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isMobile: boolean;
}

export default function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
    const pathname = usePathname();
    const [lastSync] = useState("2 hours ago");
    const [showDeployPopup, setShowDeployPopup] = useState(false);

    return (
        <>
            <DeployNotePopup isOpen={showDeployPopup} onClose={() => setShowDeployPopup(false)} />
            <AnimatePresence mode="wait">
                {isOpen && (
                    <>
                        {/* Overlay for mobile */}
                        {isMobile && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/20 z-20 lg:hidden"
                                onClick={onClose}
                            />
                        )}                    {/* Sidebar Content */}
                    <motion.aside
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{
                            type: "spring",
                            bounce: 0,
                            duration: 0.4,
                        }}
                        className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-neutral-200 px-6 py-8 pt-4 overflow-y-auto z-30"
                    >
                        <div className="flex items-center justify-between -mb-1">
                            <Link
                                href="/dashboard"
                                className="text-lg font-semibold font-mono tracking-tight"
                            >
                                Webnotes <span className="opacity-75 text-sm">[dashboard]</span>
                            </Link>
                            {isMobile && (
                                <button
                                    onClick={onClose}
                                    className="lg:hidden text-neutral-500 hover:text-neutral-900"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <div className="w-full h-px bg-black opacity-15 my-4"></div>

                        {/* Navigation */}
                        <nav className="space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors group relative cursor-pointer ${
                                            isActive
                                                ? "bg-neutral-100 text-neutral-900"
                                                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                                        }`}
                                    >
                                        <item.icon size={18} />
                                        <AnimatedText className="text-sm font-medium">
                                            {item.label}
                                        </AnimatedText>
                                        {item.isNew && (
                                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                                                New
                                            </span>
                                        )}
                                        <ChevronRight
                                            size={16}
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-opacity ${
                                                isActive
                                                    ? "opacity-100"
                                                    : "opacity-0 group-hover:opacity-100"
                                            }`}
                                        />
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="w-full h-px bg-black opacity-15 my-4"></div>

                        {/* Quick Actions */}
                        <div className="p-3 bg-neutral-0/80 rounded-xl mb-8">
                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => setShowDeployPopup(true)}
                                    className="group w-full flex items-center justify-center gap-2 bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-600 text-white py-2.5 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
                                >
                                    <Rocket size={18} />
                                    <AnimatedText>Deploy Note</AnimatedText>
                                </button>
                                {/* <button className="w-full flex items-center justify-center gap-2 bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-900 py-2.5 px-4 rounded-lg transition-colors group cursor-pointer">
                                    <RotateCw
                                        size={18}
                                        className="text-blue-500 group-hover:rotate-180 transition-transform duration-700"
                                    />
                                    <AnimatedText>Sync Now</AnimatedText>
                                </button>
                                <div className="text-xs text-center text-neutral-500 mt-1">
                                    Last synced: {lastSync}
                                </div> */}
                            </div>
                        </div>

                        {/* Bottom Links */}
                        <div className="absolute bottom-8 left-6 right-6 space-y-1">
                            <Link
                                href="/user-guide"
                                className="flex items-center gap-3 py-2 px-3 rounded-lg transition-colors group cursor-pointer text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                            >
                                <BookOpen size={18} />
                                <span className="text-sm font-medium">
                                    User Guide
                                </span>
                                <ChevronRight
                                    size={16}
                                    className="ml-auto opacity-0 group-hover:opacity-100"
                                />
                            </Link>
                            <Link
                                href="/dashboard/settings"
                                className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors group cursor-pointer ${
                                    pathname === "/dashboard/settings"
                                        ? "bg-neutral-100 text-neutral-900"
                                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                                }`}
                            >
                                <Settings size={18} />
                                <span className="text-sm font-medium">
                                    Settings
                                </span>
                                <ChevronRight
                                    size={16}
                                    className={`ml-auto transition-opacity ${
                                        pathname === "/dashboard/settings"
                                            ? "opacity-100"
                                            : "opacity-0 group-hover:opacity-100"
                                    }`}
                                />
                            </Link>
                        </div>
                    </motion.aside>
                </>
            )}
            </AnimatePresence>
        </>
    );
}
