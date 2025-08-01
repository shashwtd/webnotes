import { notFound } from "next/navigation";
import { getUserProfile } from "@/lib/api/profile";
import { ProfileProvider } from "@/components/providers/ProfileProvider";
import { Metadata } from "next";

interface ProfileLayoutProps {
    children: React.ReactNode;
    params: {
        username: string;
    };
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
    const defaultMetadata: Metadata = {
        title: "User not found",
        description: "This user does not exist on WebNotes"
    };
    
    try {
        const userProfile = await getUserProfile(params.username);
        
        if (userProfile) {
            return {
                title: `${userProfile.name} (@${params.username}) · WebNotes`,
                description: userProfile.description || `Check out ${userProfile.name}'s notes on WebNotes`,
                openGraph: {
                    title: `${userProfile.name} (@${params.username})`,
                    description: userProfile.description || `Check out ${userProfile.name}'s notes on WebNotes`,
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
        userProfile = await getUserProfile(params.username);
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
