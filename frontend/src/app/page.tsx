import Header from "@/components/Header";
import HeroSection from "@/components/homepage/HeroSection";

export default function Home() {
    return (
        <main className="w-screen min-h-screen bg-neutral-100">
            <Header />
            <HeroSection />
        </main>
    );
}
