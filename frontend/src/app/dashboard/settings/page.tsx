"use client";

import { useState } from "react";
import { Camera, Save } from "lucide-react";
import Image from "next/image";

interface SettingsForm {
    username: string;
    name: string;
    email_address: string;
    description: string;
    profile_picture_url: string;
}

export default function SettingsPage() {
    const [form, setForm] = useState<SettingsForm>({
        username: "",
        name: "",
        email_address: "",
        description: "",
        profile_picture_url: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form submitted:", form);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Account Settings</h1>
                <p className="text-neutral-500 mt-1">
                    Manage your profile and account preferences.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Section */}
                <section className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h2 className="text-lg font-medium mb-4">Profile</h2>
                    <div className="flex items-start gap-6 mb-6">
                        <div className="relative group">
                            {form.profile_picture_url ? (
                                <Image
                                    src={form.profile_picture_url}
                                    alt={form.name}
                                    width={80}
                                    height={80}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl text-white font-medium">
                                    {form.name[0]}
                                </div>
                            )}
                            <button
                                type="button"
                                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <Camera className="text-white" size={20} />
                            </button>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-neutral-700 mb-1"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    placeholder="Your full name"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-neutral-700 mb-1"
                                >
                                    Username
                                </label>
                                <div className="flex items-center">
                                    <span className="text-neutral-500 mr-2">
                                        @
                                    </span>
                                    <input
                                        type="text"
                                        id="username"
                                        value={form.username}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                username: e.target.value,
                                            }))
                                        }
                                        className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        placeholder="your-username"
                                    />
                                </div>
                                <p className="mt-1 text-sm text-neutral-500">
                                    This will be your unique URL: webnotes.co/@{form.username}
                                </p>
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-neutral-700 mb-1"
                                >
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={form.email_address}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            email_address: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Additional Info */}
                <section className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h2 className="text-lg font-medium mb-4">About You</h2>
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-neutral-700 mb-1"
                            >
                                Bio
                            </label>
                            <textarea
                                id="description"
                                value={form.description}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                rows={4}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                                placeholder="Tell us a bit about yourself..."
                            />
                        </div>
                    </div>
                </section>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                    >
                        <Save size={18} />
                        <span>Save Changes</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
