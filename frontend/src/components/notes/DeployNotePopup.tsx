"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Note } from "@/lib/api/notes";
import { useNotes } from "@/hooks/useNotes";
import { useDeployment } from "@/hooks/useDeployment";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function DeployNotePopup({ isOpen, onClose }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const { recentNotes, loading, refreshNotes } = useNotes(false); // Don't auto-fetch
    const { handleDeploy: deployNote } = useDeployment();

    const matchingNotes = recentNotes
        .filter(
            (note) =>
                !note.deployed &&
                note.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5);

    useEffect(() => {
        if (isOpen) {
            // Fetch notes when popup is opened
            refreshNotes();
        } else {
            setSearchTerm("");
            setSelectedNote(null);
        }
    }, [isOpen, refreshNotes]);

    const handleDeploy = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!selectedNote) return;
        await deployNote(selectedNote.id, selectedNote.title);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-xl w-full max-w-md mx-4 relative overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 p-1 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-neutral-500" />
                        </button>

                        <div className="p-6 flex flex-col gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Deploy a Note
                                </h2>
                                <p className="text-neutral-500 mt-1">
                                    Search and select a note to deploy.
                                </p>
                            </div>

                            <div className="relative">
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {loading ? (
                                <div className="py-8 flex items-center justify-center">
                                    <div className="animate-pulse flex items-center gap-2">
                                        <div className="h-2 w-2 bg-blue-600 rounded-full" />
                                        <div className="h-2 w-2 bg-blue-600 rounded-full animation-delay-200" />
                                        <div className="h-2 w-2 bg-blue-600 rounded-full animation-delay-400" />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {searchTerm && (
                                        <div className="border-t border-neutral-200">
                                            {matchingNotes.length > 0 ? (
                                                <div className="py-2 divide-y divide-neutral-100">
                                                    {matchingNotes.map(
                                                        (note) => (
                                                            <button
                                                                key={note.id}
                                                                onClick={() =>
                                                                    setSelectedNote(
                                                                        note
                                                                    )
                                                                }
                                                                className={`w-full px-4 py-2 text-left hover:bg-neutral-50 ${
                                                                    selectedNote?.id ===
                                                                    note.id
                                                                        ? "bg-neutral-50"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <div className="font-medium text-neutral-900">
                                                                    {note.title}
                                                                </div>
                                                                <div className="text-sm text-neutral-500">
                                                                    Updated{" "}
                                                                    {new Date(
                                                                        note.updated_at
                                                                    ).toLocaleDateString()}
                                                                </div>
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="py-8 text-center text-neutral-500">
                                                    No matching notes found
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="border-t border-neutral-200 pt-4">
                                <button
                                    onClick={handleDeploy}
                                    disabled={!selectedNote}
                                    className="w-full flex items-center justify-center gap-3 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Deploy Note
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
