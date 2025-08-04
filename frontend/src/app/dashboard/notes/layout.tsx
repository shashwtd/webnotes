import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Your Notes | MyNotes",
    description: "Manage and organize all your notes in one place",
};

export default function NotesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
