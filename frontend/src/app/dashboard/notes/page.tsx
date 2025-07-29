"use client";

import { useState, useEffect } from "react";
import { Note, listNotes } from "@/lib/api/notes";
import { FileText, Clock, ChevronDown } from "lucide-react";
import { RecentNoteCard } from "@/components/notes/RecentNoteCard";
import { DeployedNoteCard, DeployedNote } from "@/components/notes/DeployedNoteCard";

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<"latest" | "oldest" | "title">("latest");

    useEffect(() => {
        let mounted = true;

        const fetchNotes = async () => {
            try {
                const notesList = await listNotes();
                if (mounted) {
                    setNotes(notesList);
                }
            } catch (error) {
                console.error("Failed to fetch notes:", error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchNotes();

        return () => {
            mounted = false;
        };
    }, []); // Empty dependency array - fetch only once

    const getSortedNotes = (notesToSort: Note[]) => {
        switch (sortBy) {
            case "latest":
                return [...notesToSort].sort(
                    (a, b) =>
                        new Date(b.updated_at).getTime() -
                        new Date(a.updated_at).getTime()
                );
            case "oldest":
                return [...notesToSort].sort(
                    (a, b) =>
                        new Date(a.updated_at).getTime() -
                        new Date(b.updated_at).getTime()
                );
            case "title":
                return [...notesToSort].sort((a, b) =>
                    (a.title || "Untitled").localeCompare(b.title || "Untitled")
                );
            default:
                return notesToSort;
        }
    };

    const deployedNotes = getSortedNotes(
        notes.filter((note) => note.deployed === true)
    ) as DeployedNote[];
    const otherNotes = getSortedNotes(
        notes.filter((note) => note.deployed !== true)
    );

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-neutral-100 rounded-lg w-1/3"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className="h-24 bg-neutral-100 rounded-xl"
                                    ></div>
                                ))}
                            </div>
                        </div>
                        <div className="h-64 bg-neutral-100 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-2 py-2 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Your Notes
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        Manage and organize all your notes in one place.
                    </p>
                </div>
                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        className="appearance-none bg-white border border-neutral-200 hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-300 px-4 py-2 pr-10 rounded-lg transition-colors text-sm font-medium cursor-pointer"
                    >
                        <option value="latest">Sort by: Latest</option>
                        <option value="oldest">Sort by: Oldest</option>
                        <option value="title">Sort by: Title</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 w-full">
                {/* Deployed Notes Section - First on mobile */}
                <section className="order-first col-span-2 lg:order-last space-y-4 lg:space-y-6">
                    <div className="flex items-center gap-2">
                        <FileText size={20} className="text-blue-600" />
                        <h2 className="text-lg font-semibold">
                            Deployed Notes
                        </h2>
                    </div>
                    {/* THIS IS WHEN NO NOTES ARE DEPLOYED BY THE USER */}
                    {deployedNotes.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-neutral-200 min-h-64 rounded-xl p-6 sm:p-8 text-center flex items-center justify-center flex-col gap-4">
                            <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
                                <FileText
                                    size={24}
                                    className="text-blue-400"
                                />
                            </div>
                            <div>
                                <h3 className="font-medium text-neutral-900">
                                    No deployed notes
                                </h3>
                                <p className="text-sm text-neutral-500 mt-1">
                                    Deploy a note to make it accessible
                                    on the web
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {deployedNotes.map((note) => (
                                <DeployedNoteCard
                                    key={note.id}
                                    note={note}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Recent Activity Section - Second on mobile */}
                <section className="col-span-2 space-y-4 lg:space-y-6 w-full">
                    <div className="flex items-center gap-2">
                        <Clock size={20} className="text-amber-600" />
                        <h2 className="text-lg font-semibold">
                            All Notes
                        </h2>
                    </div>
                    {otherNotes.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-neutral-200 rounded-xl min-h-64 p-6 sm:p-8 text-center flex items-center justify-center flex-col gap-4">
                            <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
                                <FileText
                                    size={24}
                                    className="text-blue-400"
                                />
                            </div>
                            <div>
                                <h3 className="font-medium text-neutral-900">
                                    No recent notes
                                </h3>
                                <p className="text-sm text-neutral-500 mt-1">
                                    Please sync your notes or create a new note to see it here.
                                </p>
                            </div>
                        </div>
                    ) : (
                    <div className="space-y-2 md:space-y-4">
                        {otherNotes.map((note) => (
                            <RecentNoteCard key={note.id} note={note} />
                        ))}
                    </div>
                    )}
                </section>
            </div>
        </div>
    );
}
