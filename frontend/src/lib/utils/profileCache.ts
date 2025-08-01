import { cache } from 'react';
import { getUserProfile, UserProfile } from '@/lib/api/profile';
import { getAllNotes, Note, getPublicNote } from '@/lib/api/notes';

// Use React's cache function to deduplicate requests for user profiles
export const getUserProfileCached = cache(async (username: string): Promise<UserProfile> => {
  const profile = await getUserProfile(username);
  return JSON.parse(JSON.stringify(profile));
});

// Use React's cache function to deduplicate requests for user notes
export const getAllNotesCached = cache(async (username: string): Promise<Note[]> => {
  const notes = await getAllNotes(username);
  return JSON.parse(JSON.stringify(notes));
});

// Cache individual note requests as well
export const getPublicNoteCached = cache(async (username: string, slug: string): Promise<Note> => {
  const note = await getPublicNote(username, slug);
  return JSON.parse(JSON.stringify(note));
});
