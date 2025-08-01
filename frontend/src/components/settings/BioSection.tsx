import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { updateDescription } from "@/lib/api/profile";
import { useAuth } from "@/context/AuthContext";

export default function BioSection() {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [description, setDescription] = useState(user?.description || "");
    const [descriptionChanged, setDescriptionChanged] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleDescriptionSave = async () => {
        if (!user) return;
        
        try {
            setSaving(true);
            await updateDescription(description);
            setDescriptionChanged(false);
            // Show success indicator
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error("Failed to update description:", error);
            // Handle error (show toast notification, etc.)
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1.5">
                Bio
            </label>
            <div className="space-y-2">
                <textarea
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        setDescriptionChanged(e.target.value !== user?.description);
                    }}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none placeholder:text-neutral-400"
                    placeholder="Write a brief bio about yourself..."
                />
                <AnimatePresence>
                    {(descriptionChanged || saving || showSuccess) && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex justify-end mt-2"
                        >
                            <button
                                onClick={handleDescriptionSave}
                                disabled={saving || !descriptionChanged}
                                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                                    showSuccess 
                                        ? "bg-green-500 text-white" 
                                        : "bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-70 hover:scale-105 active:scale-95"
                                }`}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Saving changes...
                                    </>
                                ) : showSuccess ? (
                                    <>
                                        <Check size={16} />
                                        Saved successfully!
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        Save changes
                                    </>
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
