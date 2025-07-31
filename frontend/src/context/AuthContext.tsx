"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import * as authApi from "@/lib/api/auth";
import { User, RegisterData } from "@/lib/api/auth";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (usernameOrEmail: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const checkAuth = useCallback(async () => {
        try {
            const userData = await authApi.getCurrentUser();
            setUser(userData);
        } catch (err) {
            if (err instanceof Error && err.message === "Unauthorized") {
                setUser(null);
                // If on a protected route, redirect to login
                if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
                    router.push(`/login?returnUrl=${encodeURIComponent(window.location.href)}`);
                }
            } else {
                console.error("Error checking auth:", err);
                setError("Failed to check authentication");
            }
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (usernameOrEmail: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);

            await authApi.login(usernameOrEmail, password);
            await checkAuth();
            
            // Check for returnUrl in query parameters
            if (typeof window !== 'undefined') {
                const params = new URLSearchParams(window.location.search);
                const returnUrl = params.get('returnUrl');
                
                if (returnUrl && returnUrl.startsWith('/')) {
                    // Only allow internal redirects
                    router.push(returnUrl);
                } else {
                    router.push("/dashboard");
                }
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err instanceof Error ? err.message : "Failed to login");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        try {
            setError(null);
            setIsLoading(true);

            await authApi.register(data);
            await checkAuth();
            
            try {
                const userData = await authApi.getCurrentUser();
                if (userData) {
                    router.push("/dashboard");
                } else {
                    throw new Error("Failed to fetch user data after registration");
                }
            } catch {
                throw new Error("Failed to fetch user data after registration");
            }
        } catch (err) {
            console.error("Register error:", err);
            setError(err instanceof Error ? err.message : "Failed to register");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setError(null);
            setIsLoading(true);

            await authApi.logout();
            setUser(null);
            router.push("/");
        } catch (err) {
            console.error("Logout error:", err);
            setError(err instanceof Error ? err.message : "Failed to logout");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
                login,
                register,
                logout,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
