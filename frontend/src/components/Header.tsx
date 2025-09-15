"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ArrowRight } from "lucide-react";
import AnimatedText from "./AnimatedText";
import { useAuth } from "@/context/AuthContext";

const publicLinks: {
    href: string;
    label: string;
}[] = [
    // {
    //     href: "/about",
    //     label: "about",
    // },
    {
        href: "/user-guide",
        label: "user guide",
    },
];

interface HeaderProps {
    bg?: string;
    isAuthPage?: boolean;
}

export default function Header({ bg = "bg-neutral-100", isAuthPage = false }: HeaderProps) {
    const path = usePathname();
    const { user } = useAuth();

    return (
        <>
            <div className="fixed z-[60] top-0 w-full bg-slate-600 p-2 text-center text-white">
                <p className="text-sm">
                    ⚠️ This project is no longer maintained and the server has been shut down. 
                    As an open-source project, you can view and fork the code anytime on{" "}
                    <a 
                        href="https://github.com/shashwtd/webnotes" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-medium hover:text-slate-200"
                    >
                        GitHub
                    </a>
                    .
                </p>
            </div>
            <div
                className={classNames(
                    "fixed z-50 top-10 w-screen h-max px-6 md:px-12 flex items-start py-4 justify-center",
                    bg ? bg : "bg-neutral-100"
                )}
            >
                <div className="w-full flex items-start justify-between">
                    <Link
                    href="/"
                    className="group text-lg font-mono font-medium tracking-tight text-neutral-900 flex items-center justify-center gap-1"
                >
                    <span>notes</span>
                    <div className="flex items-center translate-y-0.5 justify-center">
                        <span className="duration-200 group-hover:w-8 h-0.5 w-3 bg-black ml-1.5"></span>
                        <ChevronRight className="-ml-3 left-0 size-5 text-neutral-900 opacity-0 group-hover:opacity-100" />
                    </div>
                    <span>web</span>
                </Link>
                <nav className="flex flex-col md:flex-row gap-0 md:gap-4 items-start md:items-center">
                    {!isAuthPage && (
                        <>
                            {publicLinks.map((link, i) => {
                                const isActive = path === link.href;
                                return (
                                    <Link
                                        key={i}
                                        href={link.href}
                                        className={`group flex items-center justify-center gap-2 ${
                                            isActive
                                                ? "text-neutral-900 pointer-events-none"
                                                : "text-neutral-600 hover:text-neutral-700"
                                        }`}
                                    >
                                        <span
                                            className={classNames(
                                                "text-sm group-hover:opacity-50 opacity-0",
                                            )}
                                        >
                                            ●
                                        </span>
                                        <AnimatedText className="tracking-tight lowercase font-semibold font-mono">
                                            {link.label}
                                        </AnimatedText>
                                    </Link>
                                );
                            })}
                        </>
                    )}
                    {!isAuthPage && (user ? (
                        <Link
                            href="/dashboard"
                            className="group ml-4 flex font-sans font-medium items-center justify-center gap-2 bg-neutral-200 rounded-full text-neutral-900 px-6 py-1.5 pb-2 transition-colors hover:bg-neutral-300"
                        >
                            <AnimatedText>dashboard</AnimatedText>
                            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="group flex items-center justify-center gap-2 text-neutral-600 hover:text-neutral-700"
                            >
                                <span
                                    className={classNames(
                                        "text-sm group-hover:opacity-50 opacity-0",
                                    )}
                                >
                                    ●
                                </span>
                                <AnimatedText className="tracking-tight lowercase font-semibold font-mono">
                                    login
                                </AnimatedText>
                            </Link>
                            <Link
                                href="/register"
                                className="group ml-4 flex font-sans font-medium items-center justify-center gap-2 bg-neutral-200 rounded-full text-neutral-900 px-6 py-1.5 pb-2 transition-colors hover:bg-neutral-300"
                            >
                                <AnimatedText>register</AnimatedText>
                                <ChevronRight
                                    className="-mr-1 group-hover:translate-x-1 duration-200"
                                    size={16}
                                />
                            </Link>
                        </>
                    ))}
                </nav>
                </div>
            </div>
        </>
    );
}
