"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface User {
    name: string;
    email: string;
    profile_picture_url?: string;
}

interface AccountMenuProps {
    user: User;
    onLogout: () => void;
}

export default function AccountMenu({ user, onLogout }: AccountMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 hover:bg-neutral-100 py-1.5 px-2 rounded-lg transition-colors cursor-pointer group"
            >
                <div className="size-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                    {user.profile_picture_url ? (
                        <Image
                            src={user.profile_picture_url}
                            alt={user.name}
                            className="h-full w-full rounded-full object-cover"
                            width={24}
                            height={24}
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-white font-medium">
                            {user.name[0]}
                        </div>
                    )}
                </div>
                <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-neutral-900 line-clamp-1">
                        {user.name}
                    </p>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-neutral-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg border border-neutral-200 shadow-lg py-2 z-50"
                    >
                        <div className="px-4 py-2 border-b border-neutral-200">
                            <p className="text-sm font-medium text-neutral-900">
                                {user.name}
                            </p>
                            <p className="text-sm text-neutral-500 truncate">
                                {user.email}
                            </p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                            <LogOut size={16} />
                            <span>Log out</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
