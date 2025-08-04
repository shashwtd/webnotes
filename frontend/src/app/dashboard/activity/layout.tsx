import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Activity Log | MyNotes",
    description: "Track all your actions and changes in one place",
};

export default function ActivityLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
