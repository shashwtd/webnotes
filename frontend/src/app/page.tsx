import AnimatedText from "@/components/AnimatedText";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <main className="w-screen min-h-screen bg-neutral-100">
            <section className="w-full max-h-[800px] min-h-[700px] py-32 relative overflow-hidden">
                {/* Floating Elements - Background */}
                <div className="absolute inset-0 w-full h-full">
                    <div className="absolute left-20 top-20 w-[300px] h-[300px] bg-blue-100/20 rounded-full blur-[100px]"></div>
                    <div className="absolute right-20 bottom-20 w-[250px] h-[250px] bg-neutral-200/30 rounded-full blur-[80px]"></div>
                </div>

                <div className="relative w-full max-w-[1400px] mx-auto px-6 h-full flex">
                    {/* Left Side - Floating Elements */}
                    <div className="hidden lg:block relative w-[300px]">
                        {/* Google Keep "Card" */}
                        <div className="absolute left-10 top-20 w-40 h-48 bg-white rounded-2xl shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                            <div className="w-full h-full p-4 flex flex-col gap-3">
                                <div className="w-8 h-8">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="w-full h-full"
                                    >
                                        <path
                                            fill="#FBBC04"
                                            d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"
                                        />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <div className="w-full h-2 bg-neutral-100 rounded-full"></div>
                                    <div className="w-2/3 h-2 bg-neutral-100 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        {/* Floating Note Preview */}
                        <div className="absolute left-20 top-52 w-48 h-32 bg-white rounded-2xl shadow-lg p-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                            <div className="space-y-2">
                                <div className="w-3/4 h-2 bg-blue-100 rounded-full"></div>
                                <div className="w-full h-2 bg-neutral-100 rounded-full"></div>
                                <div className="w-5/6 h-2 bg-neutral-100 rounded-full"></div>
                            </div>
                        </div>
                        {/* Small Decorative Square */}
                        <div className="absolute left-0 top-40 w-8 h-8 bg-blue-100 rounded-lg transform rotate-12"></div>
                    </div>

                    {/* Center Content */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center justify-center gap-2 mb-6 font-sans">
                            <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                Open Source
                            </span>
                            {/* <span className="px-4 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm font-medium">
                                Markdown Support
                            </span> */}
                            <span className="px-4 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm font-medium">
                                Auto-sync
                            </span>
                        </div>
                        <h1 className="font-sans text-5xl font-semibold tracking-tighter opacity-60 text-center mt-4">
                            Publish Your Notes Into
                        </h1>
                        <h1 className="font-sans text-5xl font-semibold tracking-tighter opacity-90 text-center">
                            Beautiful Web Pages, Instantly
                        </h1>
                        <p className="font-sans text-lg max-w-lg mt-6 text-center font-medium opacity-75">
                            Webnotes transforms your everyday notes into
                            elegant, shareable web pages. Write in your favorite
                            app, and let us handle the magic of web publishing.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center mt-8 gap-3">
                            <Link
                                href="/login"
                                className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-b from-neutral-300/60 to-neutral-400/30 rounded-full text-neutral-800 font-medium font-sans px-6 py-2.5 hover:to-neutral-400/50 duration-200 transition-colors"
                            >
                                <AnimatedText>Learn More</AnimatedText>
                            </Link>
                            <Link
                                href="/login"
                                className="w-full sm:w-auto group flex font-sans font-medium items-center justify-center gap-2 bg-gradient-to-b from-blue-500 hover:from-blue-600 duration-200 to-blue-700 rounded-full text-white px-6 py-2.5 transition-colors"
                            >
                                <AnimatedText>Get Started</AnimatedText>
                                <ChevronRight
                                    className="-mr-1 mb-0.5 group-hover:translate-x-1 duration-300 delay-100"
                                    size={20}
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Floating Elements */}
                    <div className="hidden lg:block relative w-[300px]">
                        {/* Apple Notes "Card" */}
                        <div className="absolute right-10 top-20 w-40 h-48 bg-white rounded-2xl shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300">
                            <div className="w-full h-full p-4 flex flex-col gap-3">
                                <div className="w-8 h-8">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="w-full h-full"
                                    >
                                        <rect
                                            x="2"
                                            y="2"
                                            width="20"
                                            height="20"
                                            rx="5"
                                            fill="#FF9F0A"
                                        />
                                        <path
                                            fill="white"
                                            d="M6 7h12v2H6zM6 11h12v2H6zM6 15h8v2H6z"
                                        />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <div className="w-full h-2 bg-neutral-100 rounded-full"></div>
                                    <div className="w-2/3 h-2 bg-neutral-100 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        {/* Floating Web Preview */}
                        <div className="absolute right-20 top-52 w-48 h-32 bg-white rounded-2xl shadow-lg p-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                            <div className="space-y-2">
                                <div className="w-3/4 h-2 bg-blue-100 rounded-full"></div>
                                <div className="w-full h-2 bg-neutral-100 rounded-full"></div>
                                <div className="w-5/6 h-2 bg-neutral-100 rounded-full"></div>
                            </div>
                        </div>
                        {/* Small Decorative Square */}
                        <div className="absolute right-4 top-40 w-8 h-8 bg-neutral-200 rounded-lg transform -rotate-12"></div>
                    </div>
                </div>

                {/* Bottom Bar - App Integrations */}
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="max-w-5xl mx-auto px-6 py-4">
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
                            <span className="font-sans text-sm font-medium text-neutral-500">
                                Seamlessly works with:
                            </span>
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2 px- rounded-xl">
                                    <Image
                                        src="/assets/apple-notes.svg"
                                        alt="Google Keep"
                                        width={28}
                                        height={28}
                                        className="border bg-black/10 p-px rounded-lg"
                                    />
                                    <span className="font-sans text-sm font-medium text-neutral-900">
                                        Apple Notes
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px- rounded-xl">
                                    <Image
                                        src="/assets/google-keep.svg"
                                        alt="Google Keep"
                                        width={24}
                                        height={24}
                                    />
                                    <span className="font-sans text-sm font-medium text-neutral-900">
                                        Google Keep{" "}
                                        <span className="opacity-50">
                                            (soon)
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
