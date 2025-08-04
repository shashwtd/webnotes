"use client";

import { useState, useEffect } from "react";
import { LucideArrowLeft } from "lucide-react";
import Chapters from "@/components/guide/Chapters";
import GettingStarted from "@/components/guide/chapters/GettingStarted";
// import Publishing from "@/components/guide/chapters/Publishing";
// import Customization from "@/components/guide/chapters/Customization";
import { getBinaryLinks } from "@/lib/api/releases";

const chapters = [
    {
        id: "getting-started",
        title: "Getting Started",
        subtitle: "Connect your Mac and start syncing",
    },
    // {
    //     id: "publishing",
    //     title: "Publishing Notes",
    //     subtitle: "Share your notes with the world",
    // },
    // {
    //     id: "customization",
    //     title: "Your Profile",
    //     subtitle: "Make Mynotes yours",
    // },
];

const cliOutput = `user@macos macos_client % ./xpt14.build
Please open the following URL in your browser to authorize the client:
http://localhost:3000/authorize-client?redirect_uri=http%3A%2F%2F127.0.0.1%3A60392
Authorization complete.
2025/08/01 17:03:50 INFO operation completed successfully time=2025-08-01T17:03:50-04:00`;

export default function UserGuidePage() {
    const [activeChapter, setActiveChapter] = useState("getting-started");
    const [downloadLinks, setDownloadLinks] = useState<{
        arm?: string;
        intel?: string;
    } | null>(null);
    const [loadingDownloads, setLoadingDownloads] = useState(true);

    useEffect(() => {
        const fetchDownloadLinks = async () => {
            try {
                setLoadingDownloads(true);
                const links = await getBinaryLinks();
                setDownloadLinks(links);
            } catch (error) {
                console.error("Failed to fetch download links:", error);
                setDownloadLinks(null);
            } finally {
                setLoadingDownloads(false);
            }
        };

        fetchDownloadLinks();
    }, []);

    useEffect(() => {
        document.title = "User Guide - Mynotes";
    }, []);

    const renderChapterContent = () => {
        switch (activeChapter) {
            case "getting-started":
                return (
                    <GettingStarted
                        downloadLinks={downloadLinks}
                        loadingDownloads={loadingDownloads}
                        cliOutput={cliOutput}
                    />
                );
            // case "publishing":
            //     return <Publishing />;
            // case "customization":
            //     return <Customization />;
            default:
                return (
                    <GettingStarted
                        downloadLinks={downloadLinks}
                        loadingDownloads={loadingDownloads}
                        cliOutput={cliOutput}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#fafaf9] font-sans">
            {/* Navigation */}
            <div className="sticky top-0 z-20 bg-white border-b border-neutral-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 lg:h-16 flex items-center justify-between">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 text-sm lg:text-base font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                        <LucideArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                        Close Guide
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
                <div className="lg:flex min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-4rem)]">
                    {/* Sidebar */}
                    <div className="lg:w-80 lg:flex-shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-neutral-200">
                        <div className="sticky top-14 lg:top-16 px-4 lg:px-6 py-4 lg:py-8">
                            <Chapters
                                chapters={chapters}
                                activeChapter={activeChapter}
                                onChapterChange={setActiveChapter}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-4 sm:px-6 lg:px-16 py-8 lg:py-12 bg-white">
                        <div className="max-w-3xl mx-auto">
                            {renderChapterContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
