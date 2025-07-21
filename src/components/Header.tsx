"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links: {
    href: string;
    label: string;
}[] = [
    {
        href: "/",
        label: "Home",
    },
    {
        href: "/explore",
        label: "Explore",
    },
    {
        href: "/share",
        label: "Share",
    },
];

export default function Header() {
    const path = usePathname();

    return (
        <div className="fixed top-0 w-screen h-max px-6 md:px-12 flex items-start pt-4 justify-between">
            <Link
                href="/"
                className="group text-lg font-mono font-semibold text-neutral-900 flex items-center justify-center gap-0.5"
            >
                <span>RGX</span>
                <span className="duration-200 group-hover:w-6 h-0.5 w-2 bg-black"></span>
                <span>2287</span>
            </Link>
            <nav className="flex flex-col md:flex-row gap-0 md:gap-8 items-start">
                {links.map((link, i) => {
                    const isActive = path === link.href;
                    return (
                        <Link
                            key={i}
                            href={link.href}
                            className={`group flex items-center justify-center gap-1 ${
                                isActive
                                    ? "text-neutral-900"
                                    : "text-neutral-600 hover:text-neutral-700"
                            }`}
                        >
                            <span className={classNames("text-sm group-hover:opacity-50",
                                isActive ? "opacity-100!" : "opacity-0"
                            )}>
                                ●
                            </span>
                            <span className="tracking-tight lowercase font-semibold font-mono">
                                {link.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
