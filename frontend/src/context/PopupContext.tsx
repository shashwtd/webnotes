"use client";

import React, { createContext, useState, ReactNode } from "react";
import { Rocket, X } from "lucide-react";
import { deployNote } from "@/lib/api/notes";

interface PopupContextType {
    showDeployPopup: (
        id: string,
        publisherUsername: string,
        noteSlug: string
    ) => void;
    hidePopup: () => void;
}

export const PopupContext = createContext<PopupContextType | undefined>(
    undefined
);

interface PopupProviderProps {
    children: ReactNode;
}

export function PopupProvider({ children }: PopupProviderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
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
        setIsOpen(true);
    };

    const hidePopup = () => {
        setIsOpen(false);
        setNoteInfo({});
    };

    const handleDeploy = () => {
    }

    return (
        <PopupContext.Provider value={{ showDeployPopup, hidePopup }}>
            {children}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex font-sans items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-md relative">
                        <button
                            onClick={hidePopup}
                            className="absolute right-4 top-4 p-1 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-neutral-500" />
                        </button>
                        <div className="p-6 flex flex-col items-start gap-6 pr-10">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl font-semibold">
                                    Deploy Note
                                </h2>
                                <p className="text-neutral-600">
                                    This action will make your note publcly
                                    accessible, and anyone with the link will be
                                    able to view it
                                </p>
                                <div className="w-full border border-black/30 h-max font-mono py-1.5 px-3 text-sm bg-black/5 my-2">
                                    mynotes.ink/{noteInfo.publisherUsername}/{noteInfo.noteSlug}
                                </div>
                            </div>
                            {/* Add deployment options and form here */}
                            <div className="space-y-4">
                                <button className="w-full flex items-center justify-center gap-3 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <Rocket size={20} /> Deploy Note
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PopupContext.Provider>
    );
}
