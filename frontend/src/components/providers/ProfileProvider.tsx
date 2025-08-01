'use client';

import { createContext, useContext } from 'react';
import { UserProfile } from '@/lib/api/profile';

const ProfileContext = createContext<UserProfile | null>(null);

export function useProfile() {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}

export function ProfileProvider({ 
    children, 
    profile 
}: { 
    children: React.ReactNode; 
    profile: UserProfile;
}) {
    return (
        <ProfileContext.Provider value={profile}>
            {children}
        </ProfileContext.Provider>
    );
}
