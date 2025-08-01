import { useState, useRef } from "react";
import { Camera, Upload } from "lucide-react";
import Image from "next/image";
import { updateProfilePicture, removeProfilePicture } from "@/lib/api/profile";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePictureSection() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [profilePicture, setProfilePicture] = useState(user?.profile_picture_url || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);
            await updateProfilePicture(file);
            
            // Create a temporary URL for immediate preview
            const newImageUrl = URL.createObjectURL(file);
            setProfilePicture(newImageUrl);
        } catch (error) {
            console.error("Failed to update profile picture:", error);
            // Handle error (show toast notification, etc.)
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveProfilePicture = async () => {
        if (!user?.name) return;
        
        try {
            setLoading(true);
            await removeProfilePicture();
            setProfilePicture("");
        } catch (error) {
            console.error("Failed to remove profile picture:", error);
            // Handle error (show toast notification, etc.)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-start gap-6">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-50 ring-2 ring-neutral-200 ring-offset-2">
                    {profilePicture ? (
                        <Image
                            src={profilePicture}
                            alt={user?.name || "Profile"}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-medium text-neutral-400">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                    )}
                </div>
                
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                    <Camera className="text-white" size={20} />
                </div>
                
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    disabled={loading}
                />
            </div>

            <div className="flex-1 space-y-1.5">
                <label className="block text-sm font-medium text-neutral-900">
                    Profile Picture
                </label>
                <p className="text-sm text-neutral-500">
                    This will be displayed on your public profile and notes.
                </p>
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="inline-flex items-center gap-2 text-sm bg-white border border-neutral-200 hover:border-neutral-300 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-neutral-50"
                    >
                        <Upload size={16} />
                        {loading ? "Uploading..." : "Upload new picture"}
                    </button>
                    {profilePicture && (
                        <button
                            onClick={handleRemoveProfilePicture}
                            disabled={loading}
                            className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
