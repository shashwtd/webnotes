import { notFound } from "next/navigation";
import Link from "next/link";
import { getUserProfile } from "@/lib/api/profile";
import { getAllNotes, Note } from "@/lib/api/notes";
import { LucideEye } from "lucide-react";

interface ProfilePageProps {
    params: Promise<{
        username: string;
    }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { username } = await params;

    const [userProfile, userNotes] = await Promise.all([
        getUserProfile(username),
        getAllNotes(username),
    ]);

    if (!userProfile) {
        notFound();
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-[#dacfbe] object-cover text-gray-900 overflow-y-auto">
            <div className="max-w-4xl xl:max-w-[1320px] flex flex-col xl:flex-row gap-16 mx-auto py-16 px-6 sm:px-8">
                {/* User Profile Header */}
                <header className="flex-1 relative mb-24">
                    <div className="bg-gradient-to-b from-white/30 to-white/30 rounded-xl backdrop-blur-sm shadow-sm border border-black/5 p-12">
                        <div className="w-full h-max flex items-center justify-start mx-auto gap-6 pb-8 border-b border-black/10">
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
                        <p className="text-base text-black/75 w-full mt-6">
                            {/* {userProfile.description || "No bio available"} */}
                            This will be displayed on your public profile and
                            This will be displayed on your public profile and
                            notes. This will be displayed on your public profile
                            and notes.
                        </p>
                        <div className="flex items-center h-max justify-start gap-6 mt-10">
                            <div className="flex flex-col items-center">
                                <span className="font-medium text-black font-mono text-lg">
                                    {userNotes.length}
                                </span>
                                <span className="text-black/60">notes</span>
                            </div>
                            <div className="h-12 w-px bg-black/15" />
                            <div className="flex flex-col items-center">
                                <span className="font-medium text-black font-mono text-lg">
                                    200
                                </span>
                                <span className="text-black/60">views</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Deployed Notes */}
                <section className="w-full mx-auto max-w-2xl">
                    <h2 className="text-3xl font-serif tracking-tight text-black mb-8">
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
                                    <div className="relative flex flex-col gap-1 bg-gradient-to-r hover:translate-x-1 from-white/75 to-white/30 hover:from-white hover:to-white/70 p-4 px-6 transition-all duration-200 hover:pl-8">
                                        <h2 className="text-2xl font-serif font-medium tracking-tight text-[#333] group-hover:italic">
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
                                            <div className="flex items-center text-black/60 gap-2 justify-center">
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
                </section>
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
            title: "User Not Found",
        };
    }

    return {
        title: `@${username} - WebNotes`,
        description:
            userProfile.description ||
            `Check out @${username}'s deployed notes on WebNotes`,
    };
}
