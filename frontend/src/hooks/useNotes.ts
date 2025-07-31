"use client";

import { useState, useEffect, useCallback } from "react";
import { Note, listNotes } from "@/lib/api/notes";

// Global state for notes to share across components
interface GlobalNotesState {
    notes: Note[];
    lastFetched: number | null;
    isLoading: boolean;
}

const globalState: GlobalNotesState = {
    notes: [],
    lastFetched: null,
    isLoading: false,
};

let globalSetters: ((notes: Note[]) => void)[] = [];

// Cache expiration time - 5 minutes
const CACHE_TTL = 5 * 60 * 1000;

const updateAllNotes = (notes: Note[]) => {
    globalState.notes = notes;
    globalState.lastFetched = Date.now();
    globalSetters.forEach((setter) => setter(notes));
};

export function useNotes(autoFetch = false) {
    const [notes, setNotes] = useState<Note[]>(globalState.notes);
    const [loading, setLoading] = useState(globalState.isLoading);
    const [error, setError] = useState<string | null>(null);

    // Register this component to receive updates
    useEffect(() => {
        globalSetters.push(setNotes);
        return () => {
            globalSetters = globalSetters.filter(
                (setter) => setter !== setNotes
            );
        };
    }, []);

    const fetchNotes = useCallback(async (force = false) => {
        // Don't fetch if already loading
        if (globalState.isLoading) return;

        // Don't fetch if we have cached data and not forcing refresh
        const now = Date.now();
        const isCacheValid =
            globalState.lastFetched &&
            now - globalState.lastFetched < CACHE_TTL;

        if (!force && isCacheValid && globalState.notes.length > 0) {
            setLoading(false);
            return;
        }

        // Set loading both locally and globally
        setLoading(true);
        globalState.isLoading = true;

        try {
            const fetchedNotes = await listNotes();
            updateAllNotes(fetchedNotes);
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
            globalState.isLoading = false;
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchNotes();
        }
    }, [autoFetch, fetchNotes]);

    const handleDeploymentChange = useCallback(
        (noteId: string, isDeployed: boolean) => {
            const updatedNotes = globalState.notes.map((note) =>
                note.id === noteId ? { ...note, deployed: isDeployed } : note
            );
            updateAllNotes(updatedNotes);
        },
        []
    );

    const recentNotes = notes.filter((note) => !note.deployed);
    const deployedNotes = notes.filter((note) => note.deployed);

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
