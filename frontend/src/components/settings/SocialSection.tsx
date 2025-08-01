import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Twitter, Github, Instagram } from "lucide-react";
import { updateSocials } from "@/lib/api/profile";
import { useAuth } from "@/context/AuthContext";

export default function SocialSection() {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [socials, setSocials] = useState({
        twitter_username: user?.twitter_username || "",
        instagram_username: user?.instagram_username || "",
        github_username: user?.github_username || ""
    });
    const [socialsChanged, setSocialsChanged] = useState(false);

    const handleSocialChange = (social: keyof typeof socials, value: string) => {
        setSocials(prev => {
            const newSocials = { ...prev, [social]: value };
            setSocialsChanged(
                newSocials.twitter_username !== user?.twitter_username ||
                newSocials.instagram_username !== user?.instagram_username ||
                newSocials.github_username !== user?.github_username
            );
            return newSocials;
        });
    };

    const handleSocialSave = async () => {
        if (!user) return;
        
        try {
            setSaving(true);
            await updateSocials(socials);
            setSocialsChanged(false);
            // Show success indicator
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error("Failed to update social links:", error);
            // Handle error (show toast notification, etc.)
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1.5">
                Social Links
            </label>
            <div className="space-y-3">
                <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Twitter size={18} className="text-neutral-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Twitter username"
                        value={socials.twitter_username}
                        onChange={(e) => handleSocialChange('twitter_username', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    />
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Instagram size={18} className="text-neutral-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Instagram username"
                        value={socials.instagram_username}
                        onChange={(e) => handleSocialChange('instagram_username', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    />
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Github size={18} className="text-neutral-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="GitHub username"
                        value={socials.github_username}
                        onChange={(e) => handleSocialChange('github_username', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    />
                </div>

                <AnimatePresence>
                    {(socialsChanged || saving || showSuccess) && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex justify-end mt-2"
                        >
                            <button
                                onClick={handleSocialSave}
                                disabled={saving || !socialsChanged}
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
