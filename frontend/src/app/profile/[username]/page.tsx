import { notFound } from 'next/navigation';
import { getUserProfile } from '@/lib/api/profile';
import { getAllNotes, Note } from '@/lib/api/notes';

interface ProfilePageProps {
    params: Promise<{
        username: string;
    }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { username } = await params;
    
    const [userProfile, userNotes] = await Promise.all([
        getUserProfile(username),
        getAllNotes(username)
    ]);
    
    if (!userProfile) {
        notFound();
    }
    
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* User Profile Header */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <div 
                            className="h-16 w-16 bg-blue-500 rounded-full bg-cover bg-center"
                            style={userProfile.profile_picture_url ? {
                                backgroundImage: `url(${userProfile.profile_picture_url})`
                            } : {}}
                        >
                            {!userProfile.profile_picture_url && (
                                <div className="h-full w-full flex items-center justify-center text-white text-xl font-bold">
                                    {username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">@{username}</h1>
                            <p className="text-gray-600">{userProfile.description || 'No bio available'}</p>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-6 text-sm text-gray-600">
                        <span>{userNotes.length} notes published</span>
                        <span>Member since {new Date(userProfile.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                
                {/* Published Notes */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Published Notes</h2>
                    
                    {userNotes.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No published notes yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {userNotes.map((note: Note) => (
                                <div key={note.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <a href={`/${note.slug}`} className="block">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">{note.title}</h3>
                                        <p className="text-gray-600 text-sm mb-2">{note.description || 'No description'}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>Published {new Date(note.updated_at).toLocaleDateString()}</span>
                                            <span>{note.views || 0} views</span>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProfilePageProps) {
    const { username } = await params;
    const userProfile = await getUserProfile(username);
    
    if (!userProfile) {
        return {
            title: 'User Not Found',
        };
    }
    
    return {
        title: `@${username} - WebNotes`,
        description: userProfile.description || `Check out @${username}'s published notes on WebNotes`,
    };
}
