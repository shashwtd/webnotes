"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import AnimatedText from "@/components/AnimatedText";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        usernameOrEmail: "",
        password: "",
    });
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setIsLoading(true);

        try {
            await login(formData.usernameOrEmail, formData.password);
            
            // The auth context will handle returnUrl redirects
            // This is just for legacy 'next' parameter support
            const params = new URLSearchParams(window.location.search);
            const nextUrl = params.get('next');
            
            if (nextUrl) {
                window.location.href = nextUrl;
            }
        } catch (err) {
            setFormError("Invalid username/email or password");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

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

            <form onSubmit={handleSubmit} className="space-y-5">
                {formError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                        {formError}
                    </div>
                )}

                <div>
                    <label
                        htmlFor="usernameOrEmail"
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                    >
                        Email or Username
                    </label>
                    <input
                        type="text"
                        id="usernameOrEmail"
                        name="usernameOrEmail"
                        value={formData.usernameOrEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-neutral-300 focus:outline-none focus:ring focus:ring-neutral-400 focus:ring-offset-0 transition-colors"
                        placeholder="john@example.com or johndoe"
                        required
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
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg bg-white border border-neutral-300 focus:outline-none focus:ring focus:ring-neutral-400 focus:ring-offset-0 transition-colors"
                            placeholder="••••••••"
                            required
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
                    disabled={isLoading}
                    className="group w-full flex focus:outline-none focus:ring hover:ring ring-blue-300 ring-offset-2 items-center justify-center gap-2 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 mt-6 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <AnimatedText>
                        {isLoading ? "Signing in..." : "Sign in"}
                    </AnimatedText>
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
