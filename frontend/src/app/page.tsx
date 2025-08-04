import Header from "@/components/Header";
import HeroSection from "@/components/homepage/HeroSection";

export const metadata = {
    title: "Mynotes",
    description: "Publish Your Notes Into Beautiful Web Pages, Instantly",
};

export default function Home() {
    return (
        <main className="w-screen min-h-screen bg-neutral-100">
            <Header />
            <HeroSection />
        </main>
    );
}
