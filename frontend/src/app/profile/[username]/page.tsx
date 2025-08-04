import { notFound } from "next/navigation";
import Link from "next/link";
import { Note } from "@/lib/api/notes";
import { getUserProfileCached, getAllNotesCached } from '@/lib/utils/profileCache';
import { LucideEye, LucideGithub, LucideInstagram, LucideTwitter} from "lucide-react";
import { Metadata } from "next";

interface ProfilePageProps {
    params: Promise<{
        username: string;
    }>;
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
    const username = params.username;
    const userProfile = await getUserProfileCached(username);
    
    if (!userProfile) {
        return {
            title: "Profile Not Found | MyNotes",
        };
    }
    
    return {
        title: `${userProfile.name}'s Profile | MyNotes`,
        description: userProfile.description || `View ${userProfile.name}'s published notes and profile`,
    };
}

const backgroundImages: string[] = [
    "https://images.unsplash.com/photo-1699006599458-b8bd9e67c3d9?q=80&w=1828",
    "https://images.unsplash.com/photo-1698239307081-375b3f3da4c0?q=80&w=2072",
    "https://images.unsplash.com/photo-1683659635689-3df761eddb70?q=80&w=1754",
]

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { username } = await params;

    const [userProfile, userNotes] = await Promise.all([
        getUserProfileCached(username),
        getAllNotesCached(username),
    ]);

    if (!userProfile) {
        notFound();
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-[#dacfbe] text-gray-900 overflow-y-auto"
        style={{
            // backgroundImage: `url(${backgroundImages[Math.floor(Math.random() * backgroundImages.length)]})`,
            backgroundImage: `url(${backgroundImages[2]})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "0% 0%",
            backgroundBlendMode: "overlay",
        }}>
            <div className="max-w-2xl xl:h-screen xl:max-w-none flex flex-col xl:flex-row justify-center mx-auto gap-8 md:gap-16 pt-8 md:pt-16 py-16 px-6 sm:px-8 relative xl:overflow-y-scroll">
                {/* User Profile Header */}
                <header className="w-full xl:sticky top-0 z-10 max-w-2xl xl:max-w-lg">
                    <div className="bg-gradient-to-b from-white/60 to-white/30 rounded-xl backdrop-blur-sm shadow-xs border border-black/5 p-12">
                        <div className="w-full h-max flex items-center justify-start mx-auto gap-6 pb-8 border-b border-black/20">
                            <div
                                className="size-20 aspect-square overflow-hidden rounded-full"
                                style={
                                    userProfile.profile_picture_url
                                        ? {
                                              backgroundImage: `url(${userProfile.profile_picture_url})`,
                                              backgroundSize: "contain",
                                          }
                                        : {}
                                }
                            ></div>
                            <div className="flex flex-col items-start">
                                <h1 className="text-3xl font-semibold tracking-tight text-black">
                                    {userProfile.name}
                                </h1>
                                <h1 className="text-lg font-mono font-medium tracking-tight text-black/60">
                                    @{userProfile.name}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-5 mt-6">
                            {(userProfile.twitter_username || userProfile.github_username || userProfile.instagram_username) && (
                                <div className="flex items-center gap-5 mb-4">
                                    {userProfile.twitter_username && (
                                        <a
                                            href={"https://x.com/" + userProfile.twitter_username}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-black/60 hover:text-black transition-colors"
                                        >
                                            <LucideTwitter className="size-6" />
                                        </a>
                                    )}
                                    {userProfile.github_username && (
                                        <a
                                            href={"https://github.com/" + userProfile.github_username}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-black/60 hover:text-black transition-colors"
                                        >
                                            <LucideGithub className="size-6" />
                                        </a>
                                    )}
                                    {userProfile.instagram_username && (
                                        <a
                                            href={"https://instagram.com/" + userProfile.instagram_username}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-black/60 hover:text-black transition-colors"
                                        >
                                            <LucideInstagram className="size-6" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="text-base text-black/75 w-full mt-2">
                            {userProfile.description || "No bio available"}
                        </p>
                        <div className="flex items-center h-max justify-start gap-6 mt-10">
                            <div className="flex flex-col items-center">
                                <span className="font-medium text-black font-mono text-lg">
                                    {userNotes.length}
                                </span>
                                <span className="text-black/60">notes</span>
                            </div>
                            <div className="h-12 w-px bg-black/15" />
                            {/* <div className="flex flex-col items-center">
                                <span className="font-medium text-black font-mono text-lg">
                                    200
                                </span>
                                <span className="text-black/60">views</span>
                            </div> */}
                        </div>
                    </div>
                </header>

                {/* Deployed Notes */}
                <section className="w-full max-w-2xl xl:max-w-x">
                    <h2 className="text-2xl pl-2 font-serif tracking-tight text-black mb-4 md:mb-8">
                        Deployed Notes
                    </h2>
                    {userNotes.length === 0 ? (
                        <div className="text-center py-16 bg-gradient-to-r from-white to-transparent backdrop-blur-sm rounded-2xl border border-black/5">
                            <p className="text-lg text-black/50">
                                No published notes yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            {userNotes.map((note: Note) => (
                                <Link
                                    key={note.id}
                                    href={`/${note.slug}`}
                                    className="group block relative overflow-hidden backdrop-blur-sm"
                                >
                                    <div className="relative flex flex-col gap-2 bg-gradient-to-r hover:translate-x-1 from-white/75 to-white/30 hover:from-white hover:to-white/70 p-4 px-6 transition-all duration-200 hover:pl-8">
                                        <h2 className="text-xl md:text-2xl font-serif font-medium tracking-tight text-[#333] group-hover:italic">
                                            {note.title}
                                        </h2>
                                        <div className="flex items-center gap-4 group-hover:pl-1 duration-200">
                                            <time className="block text-sm font-medium text-black/60">
                                                {new Date(
                                                    note.updated_at
                                                ).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </time>
                                            <span className="size-1 bg-black/20"></span>
                                            <div className="flex text-sm md:text-base items-center text-black/60 gap-2 justify-center">
                                                <LucideEye size={18} />
                                                {note.views || 0} views
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/[0.02] to-transparent" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    <div className="w-full h-20 bg-transparent"></div>
                </section>
            </div>
        </div>
    );
}