"use client";

import React, { createContext, useState, ReactNode, useCallback } from "react";
import { Rocket, X, Copy, Check, Trash2 } from "lucide-react";
import { deployNote, deleteDeployedNote } from "@/lib/api/notes";
import { motion, AnimatePresence } from "framer-motion";

type PopupStatus = 'deploy' | 'undeploy' | 'success' | 'error';

interface PopupContextType {
    showDeployPopup: (
        id: string,
        publisherUsername: string,
        noteSlug: string
    ) => void;
    showUndeployPopup: (id: string) => void;
    hidePopup: () => void;
    onDeploymentChange?: (noteId: string, isDeployed: boolean) => void;
}

export const PopupContext = createContext<PopupContextType | undefined>(
    undefined
);

interface PopupProviderProps {
    children: ReactNode;
    onDeploymentChange?: (noteId: string, isDeployed: boolean) => void;
}

export function PopupProvider({ children, onDeploymentChange }: PopupProviderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [status, setStatus] = useState<PopupStatus>('deploy');
    const [error, setError] = useState<string>('');
    const [noteInfo, setNoteInfo] = useState<{
        id?: string;
        publisherUsername?: string;
        noteSlug?: string;
    }>({});

    const showDeployPopup = (
        id: string,
        publisherUsername: string,
        noteSlug: string
    ) => {
        setNoteInfo({ id, publisherUsername, noteSlug });
        setStatus('deploy');
        setIsOpen(true);
    };

    const showUndeployPopup = (id: string) => {
        setNoteInfo({ id });
        setStatus('undeploy');
        setIsOpen(true);
    };

    const hidePopup = () => {
        setIsOpen(false);
        setTimeout(() => {
            setNoteInfo({});
            setStatus('deploy');
            setError('');
            setIsLoading(false);
            setCopied(false);
        }, 200);
    };

    const handleDeploy = async () => {
        if (!noteInfo.id) return;
        setIsLoading(true);
        try {
            await deployNote(noteInfo.id);
            setStatus('success');
            onDeploymentChange?.(noteInfo.id, true);
            setTimeout(hidePopup, 4000);
        } catch (err) {
            setError((err as Error).message);
            setStatus('error');
            setTimeout(hidePopup, 4000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUndeploy = async () => {
        if (!noteInfo.id) return;
        setIsLoading(true);
        try {
            await deleteDeployedNote(noteInfo.id);
            setStatus('success');
            onDeploymentChange?.(noteInfo.id, false);
            setTimeout(hidePopup, 4000);
        } catch (err) {
            setError((err as Error).message);
            setStatus('error');
            setTimeout(hidePopup, 4000);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = useCallback(async () => {
        const url = `mynotes.ink/${noteInfo.publisherUsername}/${noteInfo.noteSlug}`;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [noteInfo.publisherUsername, noteInfo.noteSlug]);

    return (
        <PopupContext.Provider value={{ showDeployPopup, showUndeployPopup, hidePopup }}>
            {children}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex font-sans items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-xl w-full max-w-md relative"
                        >
                            <button
                                onClick={hidePopup}
                                className="absolute right-4 top-4 p-1 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-neutral-500" />
                            </button>
                            <div className="p-6 flex flex-col items-start gap-6 pr-10">
                                {status === 'deploy' && (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <h2 className="text-xl font-semibold">Deploy Note</h2>
                                            <p className="text-neutral-600">
                                                This action will make your note publicly accessible, and anyone with the link will be able to view it
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 border border-black/30 h-max font-mono py-1.5 px-3 text-sm bg-black/5">
                                                    mynotes.ink/{noteInfo.publisherUsername}/{noteInfo.noteSlug}
                                                </div>
                                                <button
                                                    onClick={copyToClipboard}
                                                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                                    title={copied ? "Copied!" : "Copy URL"}
                                                >
                                                    {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} className="text-neutral-600" />}
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleDeploy}
                                            disabled={isLoading}
                                            className="w-full flex items-center justify-center gap-3 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                "Deploying..."
                                            ) : (
                                                <>
                                                    <Rocket size={20} /> Deploy Note
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}

                                {status === 'undeploy' && (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <h2 className="text-xl font-semibold">Remove Deployment</h2>
                                            <p className="text-neutral-600">
                                                This action will make your note private. The public URL will no longer be accessible.
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleUndeploy}
                                            disabled={isLoading}
                                            className="w-full flex items-center justify-center gap-3 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                "Removing deployment..."
                                            ) : (
                                                <>
                                                    <Trash2 size={20} /> Remove Deployment
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}

                                {status === 'success' && (
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-xl font-semibold text-green-600">Success!</h2>
                                        <p className="text-neutral-600">
                                            {noteInfo.publisherUsername 
                                                ? "Your note has been successfully deployed and is now publicly accessible."
                                                : "Your note is no longer publicly accessible."}
                                        </p>
                                    </div>
                                )}

                                {status === 'error' && (
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-xl font-semibold text-red-600">Error</h2>
                                        <p className="text-neutral-600">
                                            {error || "An unexpected error occurred. Please try again later."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
        </PopupContext.Provider>
    );
}
