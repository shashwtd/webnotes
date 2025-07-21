"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const links: {
    href: string;
    label: string;
}[] = [
    {
        href: "/about",
        label: "about",
    },
    {
        href: "/get-started",
        label: "guide",
    },
    {
        href: "/login",
        label: "login",
    },
];

export default function Header() {
    const path = usePathname();

    return (
        <div className="fixed z-50 bg-neutral-100 top-0 w-screen h-max px-6 md:px-12 flex items-start py-4 justify-center">
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
                    {links.map((link, i) => {
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
                                        "text-sm group-hover:opacity-50",
                                        isActive ? "opacity-100!" : "opacity-0"
                                    )}
                                >
                                    ●
                                </span>
                                <div className="tracking-tight lowercase font-semibold font-mono relative w-max h-max overflow-hidden">
                                    <span className="opacity-0">
                                        {link.label}
                                    </span>
                                    <span className="absolute left-0 top-0 group-hover:-top-full group-hover:opacity-0 duration-300 delay-50">
                                        {link.label}
                                    </span>
                                    <span className="absolute left-0 top-full group-hover:top-0 duration-300 delay-50">
                                        {link.label}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                    <Link
                        href="/login"
                        className="group ml-4 flex items-center font-sans font-medium text-smitems-center justify-center gap-2 bg-neutral-200 rounded-full text-neutral-900 px-6 py-1.5 pb-2 transition-colors"
                    >
                        <div className="relative w-max h-max overflow-hidden">
                            <span className="opacity-0">register</span>
                            <span className="absolute left-0 top-0 group-hover:-top-full group-hover:opacity-0 duration-300 delay-50">
                                register
                            </span>
                            <span className="absolute left-0 top-full group-hover:top-0 duration-300 delay-50">
                                register
                            </span>
                        </div>
                        <ChevronRight
                            className="-mr-1 group-hover:translate-x-1 duration-200"
                            size={16}
                        />
                    </Link>
                </nav>
            </div>
        </div>
    );
}
