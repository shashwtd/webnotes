"use client";

import { useState, useEffect } from "react";
import { Note } from "@/lib/api/notes";
import { MoreHorizontal, Edit, Trash2, ExternalLink, Copy, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useDeployment } from "@/hooks/useDeployment";

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
    const { handleUndeploy, loading } = useDeployment();
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
        <div className="bg-white border border-neutral-200 rounded-xl hover:shadow-sm transition-all">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-neutral-100 p-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <ExternalLink size={16} className="text-blue-600" />
                    </div>
                    <h3 className="font-medium text-neutral-900">
                        {note.title || "Untitled Note"}
                    </h3>
                </div>
                <div className="relative note-menu">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                        <MoreHorizontal size={18} className="text-neutral-500" />
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
                                        copyToClipboard();
                                    }}
                                    className="w-full px-4 py-2 text-sm text-left text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                                >
                                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy Link'}
                                </button>
                                <button
                                    onClick={async () => {
                                        setShowMenu(false);
                                        await handleUndeploy(note.id, note.title);
                                    }}
                                    disabled={loading}
                                    className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                                >
                                    <Trash2 size={16} />
                                    Unpublish
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            {/* URL Section */}
            {user && (
                <div className="p-4 bg-neutral-50 flex items-center gap-3 rounded-b-xl">
                    <div className="flex-1 font-mono text-sm text-neutral-600 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg">
                        {user.username}.{domain}/{slug}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={openInNewTab}
                            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-white rounded-lg transition-all"
                            title="Open in new tab"
                        >
                            <ExternalLink size={18} />
                        </button>
                        <button
                            onClick={copyToClipboard}
                            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-white rounded-lg transition-all"
                            title={copied ? "Copied!" : "Copy link"}
                        >
                            {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
