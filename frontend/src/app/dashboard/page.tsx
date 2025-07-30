"use client";

import { Globe, Rocket, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Note, listNotes } from "@/lib/api/notes";
import { Activity, listActivities } from "@/lib/api/activity";
import { ActivityFeed } from "@/components/activity/ActivityFeed";

export default function DashboardPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notesList, activitiesList] = await Promise.all([
                    listNotes(),
                    listActivities()
                ]);
                setNotes(notesList);
                setActivities(activitiesList);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
        <div className="max-w-7xl mx-auto space-y-8 p-4 pb-8">
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
                {/* Removed time filter */}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    {
                        label: "Total Views",
                        value: notes.reduce((acc, note) => acc + (note.views || 0), 0).toString(),
                        change: "Across all notes",
                        icon: Eye,
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
                        <Link 
                            href="/dashboard/activity"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View All
                        </Link>
                    </div>
                </div>

                <ActivityFeed activities={activities} limit={5} />
            </section>
        </div>
    );
}
