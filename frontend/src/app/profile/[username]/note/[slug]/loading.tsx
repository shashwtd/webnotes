import { LucideLoader2 } from "lucide-react";

const backgroundImages: string[] = [
  "https://images.unsplash.com/photo-1683659635689-3df761eddb70?q=80&w=1754",
];

export default function LoadingNote() {
  return (
    <div 
      className="min-h-screen w-full bg-[#dacfbe] text-gray-900 overflow-y-auto flex items-center justify-center px-2 sm:px-6 py-12"
      style={{
        backgroundImage: `url(${backgroundImages[0]})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0% 0%",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="size-12 flex items-center justify-center">
          <LucideLoader2 className="size-12 text-black animate-spin" />
        </div>
        <p className="text-black font-medium text-lg drop-shadow-md">Loading note...</p>
      </div>
    </div>
  );
}
