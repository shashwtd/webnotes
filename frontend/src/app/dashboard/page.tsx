"use client";

import { ChevronDown, Globe, Rocket, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Note, listNotes } from "@/lib/api/notes";

export default function DashboardPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const notesList = await listNotes();
                setNotes(notesList);
            } catch (error) {
                console.error('Failed to fetch notes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-neutral-100 rounded-lg w-1/3"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-neutral-100 rounded-xl"></div>
                        ))}
                    </div>
                    <div className="h-64 bg-neutral-100 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome back, User
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        Here&apos;s what&apos;s happening with your notes today.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 bg-white border border-neutral-200 hover:border-neutral-300 px-4 py-2 rounded-lg transition-colors">
                        <span className="text-sm font-medium">Last 7 Days</span>
                        <ChevronDown size={16} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    {
                        label: "Total Apple Notes",
                        value: notes.filter(n => n.source === 'apple').length.toString(),
                        change: "From Apple Notes",
                        icon: Clock,
                        color: "blue",
                    },
                    {
                        label: "All Notes",
                        value: notes.length.toString(),
                        change: "Total notes count",
                        icon: Globe,
                        color: "green",
                    },
                    {
                        label: "Recent Notes",
                        value: notes.filter(n => {
                            const date = new Date(n.updated_at);
                            const now = new Date();
                            const daysDiff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
                            return daysDiff <= 7;
                        }).length.toString(),
                        change: "Updated in last 7 days",
                        icon: Rocket,
                        color: "amber",
                    },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-neutral-300 transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-600">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-semibold mt-2 tracking-tight">
                                    {stat.value}
                                </p>
                            </div>
                            <div
                                className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}
                            >
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-neutral-600">
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <section className="bg-white border border-neutral-200 rounded-xl">
                <div className="px-6 py-4 border-b border-neutral-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Recent Activity</h2>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View All
                        </button>
                    </div>
                </div>

                <div className="divide-y divide-neutral-200">
                    <span className="w-full h-full flex items-center justify-center py-16 opacity-50">Activity table not active gng 🥀</span>
                    {/* {notes
                        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                        .slice(0, 3)
                        .map((note, i) => {
                            const updatedAt = new Date(note.updated_at);
                            const now = new Date();
                            const hoursDiff = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 3600));
                            const timeAgo = hoursDiff === 0 ? 'Just now' : 
                                          hoursDiff === 1 ? '1 hour ago' : 
                                          `${hoursDiff} hours ago`;

                            return {
                                title: note.source === 'apple' ? 'Apple Note Updated' : 'Note Updated',
                                description: note.title,
                                time: timeAgo,
                                icon: note.source === 'apple' ? Clock : Globe,
                                iconColor: note.source === 'apple' ? 'blue' : 'green',
                            };
                        })
                        .map((activity, i) => (
                        <div
                            key={i}
                            className="px-6 py-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                            <div
                                className={`p-2 rounded-lg bg-${activity.iconColor}-50 text-${activity.iconColor}-600`}
                            >
                                <activity.icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900">
                                    {activity.title}
                                </p>
                                <p className="text-sm text-neutral-500 truncate">
                                    {activity.description}
                                </p>
                            </div>
                            <span className="text-sm text-neutral-500 whitespace-nowrap">
                                {activity.time}
                            </span>
                        </div>
                    ))} */}
                </div>
            </section>
        </div>
    );
}
