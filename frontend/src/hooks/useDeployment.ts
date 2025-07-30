"use client";

import { deployNote, deleteDeployedNote } from "@/lib/api/notes";
import { useToast } from "@/hooks/useToast";
import { useState } from "react";
import { useNotes } from "./useNotes";

export function useDeployment() {
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { handleDeploymentChange } = useNotes();

    const handleDeploy = async (noteId: string, noteTitle: string) => {
        setLoading(true);
        const toastId = toast.loading(`Deploying "${noteTitle}"...`);
        try {
            await deployNote(noteId);
            handleDeploymentChange(noteId, true);
            toast.success(`"${noteTitle}" deployed successfully`, { id: toastId });
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : `Failed to deploy "${noteTitle}"`, 
                { id: toastId }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleUndeploy = async (noteId: string, noteTitle: string) => {
        setLoading(true);
        const toastId = toast.loading(`Removing deployment for "${noteTitle}"...`);
        try {
            await deleteDeployedNote(noteId);
            handleDeploymentChange(noteId, false);
            toast.success(`"${noteTitle}" undeployed successfully`, { id: toastId });
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : `Failed to undeploy "${noteTitle}"`, 
                { id: toastId }
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        handleDeploy,
        handleUndeploy
    };
}
