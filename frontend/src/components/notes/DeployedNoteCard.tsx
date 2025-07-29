"use client";

import { useState, useEffect } from "react";
import { Note } from "@/lib/api/notes";
import { MoreHorizontal, Edit, Trash2, ExternalLink, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { usePopup } from "@/context/usePopup";

export interface DeployedNote extends Note {
    slug?: string;
}

interface DeployedNoteCardProps {
    note: DeployedNote;
}

export function DeployedNoteCard({ note }: DeployedNoteCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const { user } = useAuth();
    const { showUndeployPopup } = usePopup();
    const slug = note.slug || note.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    
    // Construct the public URL
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'mynotes.ink';
    const publicUrl = user ? `https://${user.username}.${domain}/${slug}` : "";

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(publicUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const openInNewTab = () => {
        if (publicUrl) {
            window.open(publicUrl, '_blank');
        }
    };

    useEffect(() => {
        if (showMenu) {
            const handleClickOutside = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                if (!target.closest(".note-menu")) {
                    setShowMenu(false);
                }
            };

            document.addEventListener("click", handleClickOutside);
            return () => document.removeEventListener("click", handleClickOutside);
        }
    }, [showMenu]);

    return (
        <div className="bg-white border border-neutral-200 rounded-xl p-4 hover:border-neutral-300 transition-colors">
            <div className="flex items-start gap-4">
                <div className="h-12 w-12 relative flex-shrink-0">
                    <div className="h-full w-full rounded-lg bg-blue-50 flex items-center justify-center">
                        <ExternalLink size={20} className="text-blue-600" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-neutral-900 truncate">
                        {note.title || "Untitled Note"}
                    </h3>
                    <div className="mt-1 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                            <span className="font-mono text-neutral-600">/{slug}</span>
                        </div>
                        {user && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={openInNewTab}
                                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors font-mono bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded flex items-center gap-1"
                                    title="Open in new tab"
                                >
                                    <ExternalLink size={12} />
                                    {user.username}.{domain}/{slug}
                                </button>
                                <button
                                    onClick={copyToClipboard}
                                    className="text-xs text-neutral-600 hover:text-neutral-800 transition-colors p-1 rounded hover:bg-neutral-100"
                                    title="Copy link"
                                >
                                    {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                                </button>
                            </div>
                        )}
                    </div>
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
                                        openInNewTab();
                                    }}
                                    className="w-full px-4 py-2 text-sm text-left text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                                >
                                    <ExternalLink size={16} />
                                    Visit Note
                                </button>
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        copyToClipboard();
                                    }}
                                    className="w-full px-4 py-2 text-sm text-left text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                                >
                                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy Link'}
                                </button>
                                <hr className="my-1" />
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
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        showUndeployPopup(note.id);
                                    }}
                                    className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <Trash2 size={16} />
                                    Unpublish
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
