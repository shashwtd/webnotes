"use client";

import { useState, useEffect, useCallback } from 'react';
import { Note, listNotes } from '@/lib/api/notes';

let globalNotes: Note[] = [];
let globalSetters: ((notes: Note[]) => void)[] = [];

const updateAllNotes = (notes: Note[]) => {
    globalNotes = notes;
    globalSetters.forEach(setter => setter(notes));
};

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>(globalNotes);
    const [loading, setLoading] = useState(globalNotes.length === 0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        globalSetters.push(setNotes);
        return () => {
            globalSetters = globalSetters.filter(setter => setter !== setNotes);
        };
    }, []);

    const fetchNotes = useCallback(async () => {
        if (!loading && globalNotes.length > 0) return;
        setLoading(true);
        try {
            const fetchedNotes = await listNotes();
            updateAllNotes(fetchedNotes);
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleDeploymentChange = useCallback((noteId: string, isDeployed: boolean) => {
        updateAllNotes(globalNotes.map(note => 
            note.id === noteId 
                ? { ...note, deployed: isDeployed }
                : note
        ));
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
