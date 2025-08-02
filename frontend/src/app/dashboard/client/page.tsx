"use client";

import {
    ArrowRight,
    Shield,
    Eye,
    Zap,
    Settings,
    Sparkles,
    Rocket,
    CircleSlash,
    Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import Image from "next/image";
import { getBinaryLinks } from "@/lib/api/releases";

function DownloadSection() {
    const [clientData, setClientData] = useState<{
        error: string | null;
        intel?: string;
        arm?: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const downloadLinks = await getBinaryLinks();
                setClientData(downloadLinks);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("Failed to fetch activities:", error);
                toast.error("Failed to fetch download links");
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    return (
        <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl overflow-hidden text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 to-transparent" />

            {/* Animated Glow Effects */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000" />
            
            {/* Decorative Elements */}
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-32 h-32 opacity-20">
                <div className="w-full h-full relative">
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-2 rounded-full border-2 border-white/40 animate-[spin_8s_linear_infinite]" />
                    <div className="absolute inset-4 rounded-full border-2 border-white/30 animate-[spin_6s_linear_infinite_reverse]" />
                    <div className="absolute inset-6 rounded-full border-2 border-white/20 animate-[spin_4s_linear_infinite]" />
                </div>
            </div>
            <div className="absolute -right-10 top-10 -translate-y-1/2 w-40 h-40 opacity-20">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-20 h-0.5 bg-white/40"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    transform: `rotate(${i * 30}deg)`,
                                    transformOrigin: '0 0'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Mac Laptop Illustration */}
            <div className="absolute right-8 bottom-0 -translate-y-1/2 opacity-30">
                <Image 
                    src="/illustrations/mac-laptop.svg" 
                    alt="Mac Laptop" 
                    width={120} 
                    height={80}
                    className="text-white"
                />
            </div>

            {/* Apple Notes Icon Illustration */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 opacity-25">
                <Image 
                    src="/illustrations/apple-notes.svg" 
                    alt="Apple Notes" 
                    width={60} 
                    height={60}
                    className="text-white"
                />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-12 left-1/4 opacity-20">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
            </div>
            <div className="absolute top-20 right-1/4 opacity-20">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
            </div>
            <div className="absolute bottom-16 left-1/3 opacity-20">
                <div className="w-4 h-4 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
            </div>
            

            {/* THE ACTUAL ELEMENT */}
            <div className="relative px-8 py-12 pb-16 max-w-2xl mx-auto">
                <div className="text-center space-y-6">
                    
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Verified & Secure
                    </div>
                    
                    <div className="space-y-2 mb-12">
                        <h2 className="text-4xl font-bold tracking-tight">
                            Webnotes for Mac
                        </h2>
                        <p className="text-blue-100 text-lg max-w-md mx-auto opacity-80">
                            Select the version that matches your Mac&apos;s
                            processor.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center gap-3">
                            <div className="animate-spin">
                                <Loader2 size={20} />
                            </div>
                            <span>Loading downloads...</span>
                        </div>
                    ) : !clientData?.arm && !clientData?.intel ? (
                        <div className="text-blue-100">
                            No downloads available at the moment
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-6 max-w-xl mx-auto">
                            {clientData?.arm && (
                                <motion.div
                                    whileHover={{
                                        scale: 1.02,
                                        outline: "4px solid #fff3",
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-max rounded-xl outline-offset-2 outline-white/10 h-max hover:outline-white/25 outline-4"
                                >
                                    <a
                                        href={clientData.arm}
                                        className="flex items-center justify-center gap-6 bg-white/10 backdrop-blur-sm hover:bg-white/15 px-6 py-4 rounded-xl transition-all duration-200"
                                    >
                                        <Download size={26} />
                                        <div className="flex flex-col items-start gap-1">
                                            <h3 className="font-medium">
                                                Apple Silicon
                                            </h3>
                                            <p className="text-sm text-blue-100">
                                                For M1/M2 Macs
                                            </p>
                                        </div>
                                    </a>
                                </motion.div>
                            )}

                            {clientData?.intel && (
                                <motion.div
                                    whileHover={{
                                        scale: 1.02,
                                        outline: "4px solid #fff3",
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-max rounded-xl outline-offset-2 outline-white/10 h-max hover:outline-white/25 outline-4"
                                >
                                    <a
                                        href={clientData.intel}
                                        className="flex items-center justify-center gap-6 bg-white/10 backdrop-blur-sm hover:bg-white/15 px-6 py-4 rounded-xl transition-all duration-200"
                                    >
                                        <Download size={26} />
                                        <div className="flex flex-col items-start gap-1">
                                            <h3 className="font-medium">
                                                Intel Processor
                                            </h3>
                                            <p className="text-sm text-blue-100">
                                                For older macs
                                            </p>
                                        </div>
                                    </a>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .bg-grid-white\/10 {
                    background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E");
                }

                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
}

export default function MacClientPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-8 py-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Mac Client
                </h1>
                <p className="text-neutral-500 mt-1">
                    Download and set up the Webnotes Mac client for seamless
                    note synchronization.
                </p>
            </div>

            {/* Download Section */}
            <DownloadSection />

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                        <Sparkles size={20} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Seamless Sync</h3>
                    <p className="text-neutral-500 text-sm">
                        Automatically sync your Apple Notes with Webnotes in
                        real-time.
                    </p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                        <CircleSlash size={20} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Zero Config</h3>
                    <p className="text-neutral-500 text-sm">
                        No setup required. Just install and sign in with your
                        Webnotes account.
                    </p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                        <Rocket size={20} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                        Native Performance
                    </h3>
                    <p className="text-neutral-500 text-sm">
                        Built for macOS with native performance and system
                        integration.
                    </p>
                </div>
            </div>

            {/* Safety & Privacy Section */}
            <section className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200">
                    <h2 className="text-lg font-semibold">
                        Privacy & Security
                    </h2>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-neutral-900">
                                        Safe & Secure
                                    </h3>
                                    <p className="text-sm text-neutral-500 mt-1">
                                        Simple AppleScript integration. No
                                        special permissions.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                    <Eye size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-neutral-900">
                                        Privacy First
                                    </h3>
                                    <p className="text-sm text-neutral-500 mt-1">
                                        We sync all your notes, but you can
                                        easily opt out specific ones.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-neutral-900">
                                        Simple Setup
                                    </h3>
                                    <p className="text-sm text-neutral-500 mt-1">
                                        Just sign in with your Webnotes account
                                        and you&apos;re ready to sync.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                                    <Settings size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-neutral-900">
                                        Full Control
                                    </h3>
                                    <p className="text-sm text-neutral-500 mt-1">
                                        Choose which notes to sync and when to
                                        sync them.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Help Section - Now integrated with the card */}
                    <div className="mt-8 pt-6 border-t border-neutral-200">
                        <div className="flex items-center gap-6">
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-neutral-900">
                                    Need help getting started?
                                </h3>
                                <p className="text-sm text-neutral-500 mt-1">
                                    Our guide walks you through the simple setup
                                    process.
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => window.open("/guide/mac-client")}
                                className="flex items-center gap-2 px-5 py-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-neutral-900 font-medium text-sm transition-colors"
                            >
                                View setup guide
                                <ArrowRight size={16} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
