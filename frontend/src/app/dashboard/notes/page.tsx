"use client";

import { useState, useEffect } from "react";
import { Note, listNotes } from "@/lib/api/notes";
import { MoreHorizontal, FileText, Rocket, ExternalLink, Trash2, Edit } from "lucide-react";

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const notesList = await listNotes();
                setNotes(notesList);
            } catch (error) {
                console.error('Failed to fetch notes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();

        // Close menu when clicking outside
        const handleClickOutside = () => setActiveMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const deployedNotes = notes.filter(note => note.source === 'deployed');
    const otherNotes = notes.filter(note => note.source !== 'deployed');

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-neutral-100 rounded-lg w-1/3"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-48 bg-neutral-100 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const NoteCard = ({ note }: { note: Note }) => (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-neutral-300 transition-colors group">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="font-medium text-neutral-900 truncate">
                        {note.title || 'Untitled Note'}
                    </h3>
                    <p className="mt-2 text-sm text-neutral-600 line-clamp-3">
                        {note.body}
                    </p>
                </div>
                <div className="relative">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(activeMenu === note.id ? null : note.id);
                        }}
                        className="p-2 rounded-lg hover:bg-neutral-100 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <MoreHorizontal size={20} className="text-neutral-500" />
                    </button>
                    {activeMenu === note.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10">
                            <button 
                                onClick={() => console.log('Edit', note.id)}
                                className="w-full px-4 py-2 text-sm text-left text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                            >
                                <Edit size={16} />
                                Edit
                            </button>
                            <button 
                                onClick={() => console.log('Share', note.id)}
                                className="w-full px-4 py-2 text-sm text-left text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                            >
                                <ExternalLink size={16} />
                                Share
                            </button>
                            <button 
                                onClick={() => console.log('Delete', note.id)}
                                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs text-neutral-500">
                    Updated {new Date(note.updated_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-100 text-neutral-600">
                    <FileText size={14} />
                    <span className="text-xs">{note.source}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Your Notes
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        Manage and organize all your notes in one place.
                    </p>
                </div>
            </div>

            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <Rocket size={20} className="text-amber-600" />
                    <h2 className="text-lg font-semibold">Deployed Notes</h2>
                </div>
                {deployedNotes.length === 0 ? (
                    <p className="text-neutral-500 bg-white border border-neutral-200 rounded-xl p-8 text-center">
                        No deployed notes yet. Deploy a note to see it here.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {deployedNotes.map((note) => (
                            <NoteCard key={note.id} note={note} />
                        ))}
                    </div>
                )}
            </section>

            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    <h2 className="text-lg font-semibold">Other Notes</h2>
                </div>
                {otherNotes.length === 0 ? (
                    <p className="text-neutral-500 bg-white border border-neutral-200 rounded-xl p-8 text-center">
                        No other notes found.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {otherNotes.map((note) => (
                            <NoteCard key={note.id} note={note} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
