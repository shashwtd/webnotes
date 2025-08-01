import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPublicNote } from '@/lib/api/notes';
import Image from 'next/image';

interface NotePageProps {
    params: Promise<{
        username: string;
        slug: string;
    }>;
}

import { LucideArrowLeft, LucideEye } from "lucide-react";

const backgroundImages: string[] = [
    "https://images.unsplash.com/photo-1699006599458-b8bd9e67c3d9?q=80&w=1828",
    "https://images.unsplash.com/photo-1698239307081-375b3f3da4c0?q=80&w=2072",
    "https://images.unsplash.com/photo-1683659635689-3df761eddb70?q=80&w=1754",
];

export default async function NotePage({ params }: NotePageProps) {
    const { username, slug } = await params;
    let note;
    try {
        note = await getPublicNote(username, slug);
    } catch {
        notFound();
    }

    return (
        <div className="min-h-screen w-full bg-[#dacfbe] text-gray-900 overflow-y-auto flex items-center justify-center px-2 sm:px-6 py-12"
            style={{
                backgroundImage: `url(${backgroundImages[2]})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0% 0%",
                backgroundBlendMode: "overlay",
            }}>
            <div className="max-w-2xl w-full mx-auto">
                <div className="bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-sm rounded-2xl shadow-lg border border-black/5 p-8 sm:p-12 sm:pt-8 flex flex-col gap-8">
                    {/* Accent Bar */}
                    <div className="h-1 w-16 rounded-full bg-[#b6a484] mb-4 mx-auto" />

                    {/* Note Header */}
                    <header className="mb-8 flex flex-col gap-2 items-center text-center">
                        <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-black">
                            {note.title}
                        </h1>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-base">
                            <time className="text-black/60 font-medium">
                                {new Date(note.updated_at).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </time>
                            <span className="hidden sm:inline size-1 bg-black/20"></span>
                            <span className="flex items-center gap-2 text-black/60">
                                <LucideEye className="w-5 h-5" />
                                {note.views || 0} views
                            </span>
                        </div>
                    </header>

                    {/* Note Content */}
                    {/* <article className="mb-4 prose prose-lg prose-neutral max-w-none mx-auto text-gray-900 prose-headings:font-bold prose-a:text-[#b6a484] prose-a:underline-offset-2 prose-img:rounded-xl prose-blockquote:border-l-4 prose-blockquote:border-[#b6a484] prose-blockquote:bg-[#f5f3ee] prose-blockquote:p-2 prose-blockquote:italic prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-neutral-900/90 prose-pre:text-white prose-pre:rounded-xl prose-pre:p-4 prose-pre:overflow-x-auto"> */}
                    <article className="note-content">
                        <div dangerouslySetInnerHTML={{ __html: note.body }} />
                    </article>

                    {/* Profile Footer */}
                    <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-black/20">
                        <Link
                            href={`/`}
                            className="inline-flex items-center gap-2 text-sm font-medium text-black/60 hover:text-black transition-colors"
                        >
                            <LucideArrowLeft className="w-4 h-4" />
                            View all notes
                        </Link>
                        <Link href={`/profile/${username}`} className="flex items-center gap-4">
                            <div className="relative size-12 rounded-full overflow-hidden">
                                <Image
                                    src={note.author.image_url}
                                    alt={username}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-semibold tracking-tight text-black">{note.author.name}</span>
                                <span className="text-sm font-mono text-black/60">@{username}</span>
                            </div>
                        </Link>
                    </footer>
                </div>

                <div className="mt-6 text-center text-sm text-black/40">
                    Written in Apple Notes • Published with{' '}
                    <Link href="/" className="text-black/60 hover:text-black transition-colors">
                        WebNotes
                    </Link>
                </div>
            </div>
        </div>
    );
}