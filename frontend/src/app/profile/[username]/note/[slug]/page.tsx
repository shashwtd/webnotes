import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getUserProfileCached, getPublicNoteCached } from '@/lib/utils/profileCache';
import { LucideArrowLeft, LucideEye } from "lucide-react";
import { Metadata } from 'next';
import NoteContent from './NoteContent';

interface NotePageProps {
    params: Promise<{
        username: string;
        slug: string;
    }>;
}

const backgroundImages: string[] = [
    "https://images.unsplash.com/photo-1699006599458-b8bd9e67c3d9?q=80&w=1828",
    "https://images.unsplash.com/photo-1698239307081-375b3f3da4c0?q=80&w=2072",
    "https://images.unsplash.com/photo-1683659635689-3df761eddb70?q=80&w=1754",
];

// metadata generation for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ username: string; slug: string }>
}): Promise<Metadata> {
    const defaultMetadata: Metadata = {
        title: 'Note not found',
        description: 'The requested note could not be found on WebNotes',
    };
    
    try {
        const resolvedParams = await params;
        const note = await getPublicNoteCached(resolvedParams.username, resolvedParams.slug);
        const userProfile = await getUserProfileCached(resolvedParams.username);
        
        if (note && userProfile) {
            return {
                title: `${note.title} | by ${userProfile.name}`,
                description: `Read "${note.title}" by ${userProfile.name} on WebNotes`,
                openGraph: {
                    title: note.title,
                    description: `Read "${note.title}" by ${userProfile.name} on WebNotes`,
                    type: 'article',
                    authors: [userProfile.name],
                },
            };
        }
    } catch {
    }
    
    return defaultMetadata;
}

export default async function NotePage({ params }: NotePageProps) {
    const { username, slug } = await params;
    
    const [note, userProfile] = await Promise.all([
        getPublicNoteCached(username, slug).catch(() => null),
        getUserProfileCached(username).catch(() => null)
    ]);
    
    if (!note || !userProfile) {
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
                    <NoteContent 
                        title={note.title} 
                        htmlContent={note.body} 
                    />

                    {/* Profile Footer */}
                    <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-black/20">
                        <Link
                            href={`/`}
                            className="inline-flex items-center gap-2 text-sm font-medium text-black/60 hover:text-black transition-colors"
                        >
                            <LucideArrowLeft className="w-4 h-4" />
                            View all notes
                        </Link>
                        <Link href={`/`} className="flex items-center gap-4">
                            <div className="size-12 rounded-full overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center">
                                {userProfile.profile_picture_url ? (
                                    <Image
                                        src={userProfile.profile_picture_url}
                                        alt={userProfile.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xl font-medium text-neutral-400">
                                        {userProfile.name?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-semibold tracking-tight text-black">{userProfile.name}</span>
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