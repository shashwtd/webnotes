import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPublicNote } from '@/lib/api/notes';

interface NotePageProps {
    params: Promise<{
        username: string;
        slug: string;
    }>;
}

export default async function NotePage({ params }: NotePageProps) {
    const { username, slug } = await params;
    
    let note;
    try {
        note = await getPublicNote(username, slug);
    } catch {
        notFound();
    }
    
    return (
        <div className="min-h-screen bg-[#dbd7d2] text-gray-900">
            <div className="max-w-[800px] mx-auto pt-20 pb-16 px-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-black/5 p-10">
                    {/* Note Header */}
                    <header className="mb-12">
                        <div className="border-b border-black/10 pb-8">
                            <div className="flex flex-col gap-2.5">
                                <h1 className="text-[32px] font-bold tracking-[-0.96px] text-black">
                                    {note.title}
                                </h1>
                                <div className="flex items-center justify-between">
                                    <time className="text-lg font-medium text-black/50">
                                        {new Date(note.updated_at).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </time>
                                    <div className="flex items-center gap-3 text-black/75">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                        <span className="text-base font-medium">
                                            {note.views || 0} views
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    
                    {/* Note Content */}
                    <article className="mb-12">
                        <div 
                            className="note-content"
                            dangerouslySetInnerHTML={{ __html: note.body }}
                        />
                    </article>

                    <footer className="flex items-center justify-between pt-8 border-t border-black/5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-cover bg-center bg-black/80 flex items-center justify-center text-white text-base font-medium border-2 border-white/90">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-medium text-black">
                                    {username}
                                </span>
                                <span className="text-sm text-black/50">
                                    @{username}
                                </span>
                            </div>
                        </div>
                        
                        <Link
                            href={`/`}
                            className="text-sm font-medium text-black/60 hover:text-black transition-colors"
                        >
                            View all notes →
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