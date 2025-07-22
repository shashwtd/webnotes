"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import AnimatedText from "@/components/AnimatedText";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold tracking-tight mb-2">
                    Welcome Back
                </h1>
                <p className="text-neutral-600">
                    Continue sharing your ideas with the world
                </p>
            </div>

            <form className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-neutral-300 focus:outline-none  focus:ring focus:ring-neutral-400 focus:ring-offset-0 transition-colors"
                        placeholder="john@example.com"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                            Password
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            className="w-full px-4 py-2.5 rounded-lg bg-white border border-neutral-300 focus:outline-none  focus:ring focus:ring-neutral-400 focus:ring-offset-0 transition-colors"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 p-1 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="group w-full flex focus:outline-none focus:ring hover:ring ring-blue-300 ring-offset-2 items-center justify-center gap-2 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 mt-6 cursor-pointer"
                >
                    <AnimatedText>Sign In</AnimatedText>
                    <ChevronRight size={18} className="ml-1" />
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-neutral-300/50 text-center">
                <p className="text-sm text-neutral-600">
                    New to Webnotes?{" "}
                    <Link href="/register" className="text-blue-600 hover:text-blue-700">
                        Create an account
                    </Link>
                </p>
            </div>
        </>
    );
}
