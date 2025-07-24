"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { Eye, EyeOff, ChevronRight, Check, Loader2 } from "lucide-react";
import AnimatedText from "@/components/AnimatedText";
import { useAuth } from "@/context/AuthContext";
import debounce from "lodash/debounce";

export default function RegisterPage() {
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [usernameStatus, setUsernameStatus] = useState<{
        loading: boolean;
        valid: boolean;
        error: string | null;
    }>({
        loading: false,
        valid: false,
        error: null,
    });

    const debouncedUsernameCheck = useMemo(
        () => debounce(async (username: string) => {
            if (!username) {
                return {
                    loading: false,
                    valid: false,
                    error: "Username is required"
                };
            }

            // Check minimum length before making API call
            if (username.length < 4) {
                return {
                    loading: false,
                    valid: false,
                    error: "Username must be at least 4 characters long"
                };
            }

            try {
                const response = await fetch(`/api/auth/usernameExists?username=${username}`);
                const data = await response.json();

                return {
                    loading: false,
                    valid: !data.exists,
                    error: data.error || (data.exists ? "Username is already taken" : null)
                };
            } catch (error) {
                console.error("Username check error:", error);
                return {
                    loading: false,
                    valid: false,
                    error: "Failed to check username"
                };
            }
        }, 500),
        []
    );

    const checkUsername = useCallback(async (username: string) => {
        setUsernameStatus(prev => ({ ...prev, loading: true }));
        const result = await debouncedUsernameCheck(username);
        if (result) {
            setUsernameStatus(result);
        }
    }, [debouncedUsernameCheck]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        // Validate username first
        if (!formData.username) {
            setFormError("Username is required");
            return;
        }

        if (!usernameStatus.valid) {
            setFormError(usernameStatus.error || "Please choose a valid username");
            return;
        }

        setIsLoading(true);

        try {
            await register(formData);
            
            // we gotta redirect to the next parameter if it's there
            const params = new URLSearchParams(window.location.search);
            const nextUrl = params.get('next');
            
            if (nextUrl) {
                window.location.href = nextUrl;
            }
        } catch (err) {
            console.error("Registration error:", err);
            setFormError("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (formData.username) {
            checkUsername(formData.username);
        }
    }, [formData.username, checkUsername]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold tracking-tight mb-2">
                    Create Account
                </h1>
                <p className="text-neutral-600">
                    Join thousands of writers and researchers
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {formError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                        {formError}
                    </div>
                )}
                
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-neutral-300 focus:outline-none focus:ring focus:ring-neutral-400 focus:ring-offset-0 transition-colors"
                        placeholder="John Doe"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Username
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full pl-4 pr-10 py-2.5 rounded-lg bg-white border focus:outline-none focus:ring focus:ring-neutral-400 focus:ring-offset-0 transition-colors ${
                                usernameStatus.error
                                    ? "border-red-300 focus:ring-red-400"
                                    : usernameStatus.valid
                                    ? "border-green-300 focus:ring-green-400"
                                    : "border-neutral-300"
                            }`}
                            placeholder="johndoe"
                            required
                            minLength={4}
                        />
                        <div className="absolute right-3 p-1 top-1/2 -translate-y-1/2 [&:has(~[data-bw-frame])]:right-8">
                            {usernameStatus.loading ? (
                                <Loader2 size={18} className="animate-spin text-neutral-400" />
                            ) : usernameStatus.valid ? (
                                <Check size={18} className="text-green-500" />
                            ) : null}
                        </div>
                    </div>
                    <p className="mt-1.5 text-xs text-neutral-500">
                        Must be at least 4 characters
                    </p>
                    {usernameStatus.error && (
                        <p className="mt-1 text-xs text-red-500">
                            {usernameStatus.error}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-neutral-300 focus:outline-none focus:ring focus:ring-neutral-400 focus:ring-offset-0 transition-colors"
                        placeholder="john@example.com"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 pr-12 py-2.5 rounded-lg bg-white border border-neutral-300 focus:outline-none focus:ring focus:ring-neutral-400 focus:ring-offset-0 transition-colors"
                            placeholder="••••••••"
                            required
                            minLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-8 p-1 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                    <p className="mt-1.5 text-xs text-neutral-500">
                        Must be at least 8 characters
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="group w-full flex focus:outline-none focus:ring hover:ring ring-blue-300 ring-offset-2 items-center justify-center gap-2 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 mt-6 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <AnimatedText>
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </AnimatedText>
                    <ChevronRight size={18} className="ml-1" />
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-neutral-300/50 text-center">
                <p className="text-sm text-neutral-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:text-blue-700">
                        Sign in
                    </Link>
                </p>
            </div>
        </>
    );
}
