import type { Metadata } from "next";
import '@/styles/note.css';

export const metadata: Metadata = {
    title: "User Profile - WebNotes",
    description: "View user profiles and Deployed notes",
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen font-sans">
            {children}
        </div>
    );
}