"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { X } from 'lucide-react';

interface PopupContextType {
    showDeployPopup: (noteId?: string) => void;
    hidePopup: () => void;
}

export const PopupContext = createContext<PopupContextType | undefined>(undefined);

interface PopupProviderProps {
    children: ReactNode;
}

export function PopupProvider({ children }: PopupProviderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [noteId, setNoteId] = useState<string | undefined>();

    const showDeployPopup = (id?: string) => {
        setNoteId(id);
        setIsOpen(true);
    };

    const hidePopup = () => {
        setIsOpen(false);
        setNoteId(undefined);
    };

    return (
        <PopupContext.Provider value={{ showDeployPopup, hidePopup }}>
            {children}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-md relative">
                        <button 
                            onClick={hidePopup}
                            className="absolute right-4 top-4 p-1 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-neutral-500" />
                        </button>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Deploy Note</h2>
                            <p className="text-neutral-600 mb-4">
                                Choose how you want to deploy this note to the web.
                            </p>
                            {/* Add deployment options and form here */}
                            <div className="space-y-4">
                                <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Deploy as Web Page
                                </button>
                                <button className="w-full py-2 px-4 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors">
                                    Deploy as Blog Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PopupContext.Provider>
    );
}
