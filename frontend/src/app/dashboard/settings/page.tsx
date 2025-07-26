"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateDescription, updateProfilePicture, removeProfilePicture } from "@/lib/api/profile";
import { Upload, Camera, Bell, Shield, ArrowRight, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [description, setDescription] = useState(user?.description || "");
    const [descriptionChanged, setDescriptionChanged] = useState(false);
    const [profilePicture, setProfilePicture] = useState(user?.profile_picture_url || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset descriptionChanged when user changes
    useEffect(() => {
        setDescriptionChanged(false);
    }, [user]);

    useEffect(() => {
        if (user) {
            setDescription(user.description || "");
            setProfilePicture(user.profile_picture_url || "");
        }
    }, [user]);

    const handleDescriptionSave = async () => {
        if (!user) return;
        
        try {
            setSaving(true);
            await updateDescription(description);
            // You might want to update the user context here if needed
        } catch (error) {
            console.error("Failed to update description:", error);
            // Handle error (show toast notification, etc.)
        } finally {
            setSaving(false);
        }
    };

    const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);
            await updateProfilePicture(file);
            
            // Create a temporary URL for immediate preview
            const newImageUrl = URL.createObjectURL(file);
            setProfilePicture(newImageUrl);
            
            // You might want to update the user context here if needed
        } catch (error) {
            console.error("Failed to update profile picture:", error);
            // Handle error (show toast notification, etc.)
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveProfilePicture = async () => {
        if (!user?.name) return;
        
        try {
            setLoading(true);
            await removeProfilePicture();
            setProfilePicture("");
        } catch (error) {
            console.error("Failed to remove profile picture:", error);
            // Handle error (show toast notification, etc.)
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                <p className="text-neutral-500 mt-1">
                    Manage your account settings and preferences.
                </p>
            </div>

            {/* Profile Section */}
            <section className="bg-white border border-neutral-200 rounded-xl overflow-hidden transition-shadow hover:shadow-sm">
                <div className="px-6 py-4 border-b border-neutral-200">
                    <h2 className="text-lg font-semibold">Profile</h2>
                </div>
                
                <div className="p-6 space-y-8">
                    {/* Profile Picture */}
                    <div className="flex items-start gap-6">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-50 ring-2 ring-neutral-200 ring-offset-2">
                                {profilePicture ? (
                                    <Image
                                        src={profilePicture.slice(8)}
                                        alt={user.name || "Profile"}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl font-medium text-neutral-400">
                                        {user.name?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            
                            {/* Upload Overlay */}
                            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                <Camera className="text-white" size={20} />
                            </div>
                            
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleProfilePictureUpload}
                                disabled={loading}
                            />
                        </div>

                        <div className="flex-1 space-y-1.5">
                            <label className="block text-sm font-medium text-neutral-900">
                                Profile Picture
                            </label>
                            <p className="text-sm text-neutral-500">
                                This will be displayed on your public profile and notes.
                            </p>
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 text-sm bg-white border border-neutral-200 hover:border-neutral-300 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-neutral-50"
                                >
                                    <Upload size={16} />
                                    {loading ? "Uploading..." : "Upload new picture"}
                                </button>
                                {profilePicture && (
                                    <button
                                        onClick={handleRemoveProfilePicture}
                                        disabled={loading}
                                        className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-900 mb-1.5">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={user.name || ""}
                                    disabled
                                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-900 mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user.email || ""}
                                    disabled
                                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1.5">
                                Username & Public URL
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={user.username || ""}
                                    disabled
                                    className="w-full pl-4 pr-32 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-500 cursor-not-allowed"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400 pointer-events-none">
                                    .webnotes.io
                                </div>
                            </div>
                            <p className="text-xs text-neutral-500 mt-1">
                                Your public URL: <span className="font-medium">{user.username}.webnotes.io</span>
                            </p>
                        </div>

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
                                    {descriptionChanged && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }} 
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex justify-end mt-2"
                                        >
                                            <button
                                                onClick={handleDescriptionSave}
                                                disabled={saving}
                                                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium disabled:opacity-70 hover:scale-105 active:scale-95"
                                            >
                                                {saving ? (
                                                    <>
                                                        <Loader2 size={16} className="animate-spin" />
                                                        Saving changes...
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
                    </div>
                </div>
            </section>

            {/* App Settings Section */}
            <section className="bg-white border border-neutral-200 rounded-xl overflow-hidden transition-shadow hover:shadow-sm">
                <div className="px-6 py-4 border-b border-neutral-200">
                    <h2 className="text-lg font-semibold">App Settings</h2>
                </div>
                
                <div className="divide-y divide-neutral-100">
                    <div className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer">
                        <div className="space-y-0.5">
                            <h3 className="text-sm font-medium">Email Notifications</h3>
                            <p className="text-sm text-neutral-500">Get emails about your notes and shares</p>
                        </div>
                        <motion.div 
                            className="h-6 w-11 relative inline-flex items-center rounded-full bg-neutral-200 cursor-pointer transition-colors"
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.span 
                                className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white shadow-sm"
                                layout
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30
                                }}
                            />
                        </motion.div>
                    </div>

                    <div className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer">
                        <div className="space-y-0.5">
                            <h3 className="text-sm font-medium">Auto-sync Notes</h3>
                            <p className="text-sm text-neutral-500">Automatically sync your notes in real-time</p>
                        </div>
                        <motion.div 
                            className="h-6 w-11 relative inline-flex items-center rounded-full bg-blue-500 cursor-pointer transition-colors"
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.span 
                                className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white shadow-sm"
                                layout
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30
                                }}
                            />
                        </motion.div>
                    </div>

                    <div className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer">
                        <div className="space-y-0.5">
                            <h3 className="text-sm font-medium">Privacy Settings</h3>
                            <p className="text-sm text-neutral-500">Manage your notes&apos; visibility and sharing options</p>
                        </div>
                        <motion.button 
                            className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors rounded-full hover:bg-neutral-100"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowRight size={18} />
                        </motion.button>
                    </div>
                </div>
            </section>
        </div>
    );
}
