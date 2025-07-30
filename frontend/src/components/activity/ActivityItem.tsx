"use client";

import { Activity } from "@/lib/api/activity";
import { formatDistanceToNow } from "date-fns";
import { Shield, LogIn, Image, Globe, Trash, UserCircle } from "lucide-react";

interface ActivityItemProps {
    activity: Activity;
}

const activityConfig = {
    new_login: {
        icon: LogIn,
        color: "blue",
        title: "New Login",
    },
    profile_picture_updated: {
        icon: Image,
        color: "purple",
        title: "Profile Picture Updated",
    },
    note_deployed: {
        icon: Globe,
        color: "green",
        title: "Note Published",
    },
    note_undeployed: {
        icon: Trash,
        color: "red",
        title: "Note Unpublished",
    },
    profile_updated: {
        icon: UserCircle,
        color: "amber",
        title: "Profile Updated",
    },
};

const defaultConfig = {
    icon: Shield,
    color: "neutral",
    title: "Activity",
};

export function ActivityItem({ activity }: ActivityItemProps) {
    const config = activityConfig[activity.type as keyof typeof activityConfig] || defaultConfig;
    const timeAgo = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });

    return (
        <div className="px-6 py-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors cursor-pointer">
            <div className={`p-2 rounded-lg bg-${config.color}-50 text-${config.color}-600`}>
                <config.icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">
                    {config.title}
                </p>
                <p className="text-sm text-neutral-500 truncate">
                    {activity.description}
                </p>
            </div>
            <span className="text-sm text-neutral-500 whitespace-nowrap">
                {timeAgo}
            </span>
        </div>
    );
}
