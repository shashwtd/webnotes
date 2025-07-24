"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    email: string;
    username: string;
    name: string;
    description: string;
    profile_picture_url: string;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (usernameOrEmail: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

interface RegisterData {
    email: string;
    username: string;
    name: string;
    password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const checkAuth = async () => {
        try {
            const response = await fetch("/api/auth/me");
            if (!response.ok) {
                if (response.status === 401) {
                    setUser(null);
                    return;
                }
                throw new Error("Failed to check authentication");
            }
            const data = await response.json();
            setUser(data);
        } catch (err) {
            console.error("Error checking auth:", err);
            setError("Failed to check authentication");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (usernameOrEmail: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    [usernameOrEmail.includes("@") ? "email" : "username"]:
                        usernameOrEmail,
                    password,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to login");
            }

            await checkAuth();
            router.push("/dashboard");
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

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to register");
            }

            await checkAuth();
            const newUser = await fetch("/api/auth/me").then(res => res.json());
            if (newUser && !newUser.error) {
                router.push("/dashboard");
            } else {
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

            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to logout");
            }

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
