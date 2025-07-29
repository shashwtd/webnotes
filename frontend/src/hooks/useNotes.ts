"use client";

import { useState, useEffect, useCallback } from 'react';
import { Note, listNotes } from '@/lib/api/notes';

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotes = useCallback(async () => {
        try {
            const fetchedNotes = await listNotes();
            setNotes(fetchedNotes);
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleDeploymentChange = useCallback((noteId: string, isDeployed: boolean) => {
        setNotes(currentNotes => 
            currentNotes.map(note => 
                note.id === noteId 
                    ? { ...note, deployed: isDeployed }
                    : note
            )
        );
    }, []);

    const recentNotes = notes.filter(note => !note.deployed);
    const deployedNotes = notes.filter(note => note.deployed);

    return {
        notes,
        recentNotes,
        deployedNotes,
        loading,
        error,
        refreshNotes: fetchNotes,
        handleDeploymentChange,
    };
}
