"use client";

import { ChevronDown, Globe, Rocket, Clock } from "lucide-react";

export default function DashboardPage() {
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
                        value: "128",
                        change: "All synced",
                        icon: Clock,
                        color: "blue",
                    },
                    {
                        label: "Deployed Notes",
                        value: "24",
                        change: "Live on web",
                        icon: Globe,
                        color: "green",
                    },
                    {
                        label: "Ready to Deploy",
                        value: "16",
                        change: "Not yet published",
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
                    {[
                        {
                            title: "Note Deployed",
                            description:
                                "'Building a Second Brain' is now live on your blog",
                            time: "2 hours ago",
                            icon: Rocket,
                            iconColor: "blue",
                        },
                        {
                            title: "Notes Synced",
                            description:
                                "Successfully synced 12 notes from Apple Notes",
                            time: "4 hours ago",
                            icon: Clock,
                            iconColor: "green",
                        },
                        {
                            title: "Blog Post Updated",
                            description:
                                "Changes from Apple Notes were synced to 'My Product Design Process'",
                            time: "6 hours ago",
                            icon: Globe,
                            iconColor: "amber",
                        },
                    ].map((activity, i) => (
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
                    ))}
                </div>
            </section>
        </div>
    );
}
