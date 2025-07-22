"use client";

import { useState } from "react";
import { Camera, Save } from "lucide-react";

interface SettingsForm {
    name: string;
    email: string;
    urlHandle: string;
    blogTitle: string;
    blogDescription: string;
}

export default function SettingsPage() {
    const [form, setForm] = useState<SettingsForm>({
        name: "John Doe",
        email: "john@example.com",
        urlHandle: "johndoe",
        blogTitle: "John's Notes",
        blogDescription: "Thoughts and notes about technology and life.",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form submitted:", form);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                <p className="text-neutral-500 mt-1">
                    Manage your account and blog preferences.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Section */}
                <section className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h2 className="text-lg font-medium mb-4">Profile</h2>
                    <div className="flex items-start gap-6 mb-6">
                        <div className="relative group">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl text-white font-medium">
                                {form.name[0]}
                            </div>
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
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-neutral-700 mb-1"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Blog Settings */}
                <section className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h2 className="text-lg font-medium mb-4">Blog Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="urlHandle"
                                className="block text-sm font-medium text-neutral-700 mb-1"
                            >
                                URL Handle
                            </label>
                            <div className="flex items-center">
                                <span className="text-neutral-500 mr-2">
                                    webnotes.co/
                                </span>
                                <input
                                    type="text"
                                    id="urlHandle"
                                    value={form.urlHandle}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            urlHandle: e.target.value,
                                        }))
                                    }
                                    className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="blogTitle"
                                className="block text-sm font-medium text-neutral-700 mb-1"
                            >
                                Blog Title
                            </label>
                            <input
                                type="text"
                                id="blogTitle"
                                value={form.blogTitle}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        blogTitle: e.target.value,
                                    }))
                                }
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="blogDescription"
                                className="block text-sm font-medium text-neutral-700 mb-1"
                            >
                                Blog Description
                            </label>
                            <textarea
                                id="blogDescription"
                                value={form.blogDescription}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        blogDescription: e.target.value,
                                    }))
                                }
                                rows={3}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
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
