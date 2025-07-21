import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <main className="w-screen h-screen gap-2 bg-neutral-100">
            <section className="w-full h-screen flex flex-col items-center justify-center gap-2">
                <h1 className="font-sans text-5xl font-semibold tracking-tighter opacity-60">
                    Wanna create a Journal?
                </h1>
                <h1 className="font-sans text-5xl font-semibold tracking-tighter opacity-90">
                    It&apos;s done easy with Webnotes
                </h1>
                <p className="font-sans text-lg  max-w-lg mt-2 text-center font-medium opacity-75">
                    Webnotes is a simple, open-source journalling companion app
                    that helps you sync your notes to the internet. The
                </p>
                <div className="flex items-center justify-center mt-6 gap-3">
                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 bg-gradient-to-b from-neutral-300/60 to-neutral-400/30 rounded-full text-neutral-800 font-medium font-sans px-6 py-2 hover:to-neutral-400/50 duration-200 transition-colors"
                    >
                        Learn More 
                    </Link>
                    <Link
                        href="/login"
                        className="group flex font-sans font-medium items-center justify-center gap-2 bg-gradient-to-b from-blue-500 hover:from-blue-600 duration-200 to-blue-700 rounded-full text-white px-6 py-2 transition-colors"
                    >
                        Get Started <ChevronRight className="-mr-1 mb-0.5 group-hover:translate-x-1 duration-200" size={20}/>
                    </Link>
                </div>
            </section>
        </main>
    );
}
