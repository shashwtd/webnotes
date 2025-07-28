import { notFound } from 'next/navigation';
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
    } catch (error) {
        console.error('Error fetching note:', error);
        notFound();
    }
    
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Note Header */}
                <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{note.title}</h1>
                        
                        {note.description && (
                            <p className="text-lg text-gray-600 mb-6">{note.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between border-t pt-6">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">@{username}</p>
                                    <p className="text-sm text-gray-600">
                                        Last updated {new Date(note.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="text-sm text-gray-500">
                                {note.views || 0} views
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Note Content */}
                <div className="bg-white rounded-lg shadow-sm border p-8">
                    <div 
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: note.body }}
                    />
                </div>
                
                {/* Back to Profile */}
                <div className="mt-8 text-center">
                    <a 
                        href={`//${username}.${process.env.NEXT_PUBLIC_DOMAIN}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                        ← Back to @{username}&apos;s profile
                    </a>
                </div>
            </div>
        </div>
    );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: NotePageProps) {
    const { username, slug } = await params;
    
    let note;
    try {
        note = await getPublicNote(username, slug);
    } catch (error) {
        return {
            title: 'Note Not Found',
        };
    }
    
    return {
        title: `${note.title} - @${username}`,
        description: note.description || `Read ${note.title} by @${username} on WebNotes`,
        openGraph: {
            title: note.title,
            description: note.description,
            type: 'article',
            publishedTime: note.created_at,
            authors: [`@${username}`],
        },
        twitter: {
            card: 'summary_large_image',
            title: note.title,
            description: note.description,
            creator: `@${username}`,
        },
    };
}
