import { Metadata } from "next";
import DashboardClientLayout from "./client-layout";

export const metadata: Metadata = {
    title: "Dashboard | MyNotes",
    description: "View your notes activity and statistics at a glance",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
