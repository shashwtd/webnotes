import { notFound } from "next/navigation";
import { getUserProfile } from "@/lib/api/profile";
import { ProfileProvider } from "@/components/providers/ProfileProvider";
import { Metadata } from "next";

interface ProfileLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        username: string;
    }>;
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
    const defaultMetadata: Metadata = {
        title: "User not found",
        description: "This user does not exist on MyNotes"
    };
    
    try {
        const resolvedParams = await params;
        const userProfile = await getUserProfile(resolvedParams.username);
        
        if (userProfile) {
            return {
                title: `${userProfile.name} (@${resolvedParams.username}) · MyNotes`,
                description: userProfile.description || `Check out ${userProfile.name}'s notes on MyNotes`,
                openGraph: {
                    title: `${userProfile.name} (@${resolvedParams.username})`,
                    description: userProfile.description || `Check out ${userProfile.name}'s notes on MyNotes`,
                    type: 'profile',
                },
            };
        }
    } catch {
    }
    
    return defaultMetadata;
}

export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
    let userProfile;
    try {
        const resolvedParams = await params;
        userProfile = await getUserProfile(resolvedParams.username);
    } catch {
        notFound();
    }

    if (!userProfile) {
        notFound();
    }

    const serializedProfile = JSON.parse(JSON.stringify(userProfile));

    return (
        <ProfileProvider profile={serializedProfile}>
            {children}
        </ProfileProvider>
    );
}
