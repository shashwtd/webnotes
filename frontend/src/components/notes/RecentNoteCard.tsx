"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Note } from "@/lib/api/notes";
import { MoreHorizontal, Edit, Rocket, Trash2 } from "lucide-react";
import { usePopup } from "@/context/usePopup";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface RecentNoteCardProps {
    note: Note;
}

export function RecentNoteCard({ note }: RecentNoteCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const { showDeployPopup } = usePopup();
    const menuRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (showMenu) {
            const handleClickOutside = (e: MouseEvent) => {
                if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                    setShowMenu(false);
                }
            };

            document.addEventListener("click", handleClickOutside);
            return () => document.removeEventListener("click", handleClickOutside);
        }
    }, [showMenu]);

    return (
        <div ref={menuRef} className="group bg-white border border-neutral-200 rounded-xl p-4 transition-all flex items-center gap-4">
            <div className="h-12 w-12 relative flex-shrink-0">
                <div className="h-full w-full rounded-lg bg-neutral-100 flex items-center justify-center border border-neutral-200">
                    {note.source === "apple-notes" && (
                        <div className="relative w-7 h-7">
                            <Image
                                src="/assets/apple-notes.svg"
                                alt="Apple Notes"
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium text-neutral-900 truncate">
                        {note.title || "Untitled Note"}
                    </h3>
                    {note.source !== "deployed" && (
                        <button
                            onClick={() => showDeployPopup(
                                note.id,
                                user?.username || "",
                                note.slug || ""
                            )}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-50 rounded text-blue-600"
                            title="Deploy note"
                        >
                            <Rocket size={14} />
                        </button>
                    )}
                </div>
                <p className="text-sm text-neutral-500">
                    Updated {new Date(note.updated_at).toLocaleDateString()}
                </p>
            </div>
            <div className="relative note-menu">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                    }}
                    className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                    <MoreHorizontal size={20} className="text-neutral-500" />
                </button>
                <AnimatePresence>
                    {showMenu && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10"
                        >
                            <button
                                onClick={() => {
                                    setShowMenu(false);
                                    // TODO: Implement edit
                                }}
                                className="w-full px-4 py-2 text-sm text-left text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                            >
                                <Edit size={16} />
                                Edit
                            </button>
                            {note.source !== "deployed" && (
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        showDeployPopup(
                                            note.id,
                                            user?.username || "",
                                            note.slug || ""
                                        );
                                    }}
                                    className="w-full px-4 py-2 text-sm text-left text-blue-600 hover:bg-blue-50 flex items-center gap-2 font-medium"
                                >
                                    <Rocket size={16} />
                                    Deploy
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    setShowMenu(false);
                                    // TODO: Implement delete
                                }}
                                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
