"use client";

import { useAuth } from "@/context/AuthContext";
import { Bell, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ProfilePictureSection from "@/components/settings/ProfilePictureSection";
import BioSection from "@/components/settings/BioSection";
import SocialSection from "@/components/settings/SocialSection";

export default function SettingsPage() {
    const { user } = useAuth();
    if (!user) {
        return null;
    }

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
                    <ProfilePictureSection />

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

                        <BioSection />
                        <SocialSection />
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
