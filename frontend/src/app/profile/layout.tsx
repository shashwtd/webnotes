import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "User Profile - WebNotes",
    description: "View user profiles and published notes",
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    );
}
