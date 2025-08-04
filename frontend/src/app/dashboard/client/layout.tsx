import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mac Client | MyNotes",
    description: "Download and set up the MyNotes Mac client for seamless note synchronization",
};

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
