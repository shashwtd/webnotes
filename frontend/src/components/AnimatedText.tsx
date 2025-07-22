interface AnimatedTextProps {
    children: string;
    className?: string;
}

export default function AnimatedText({ children, className = "" }: AnimatedTextProps) {
    return (
        <div className={`relative w-max h-max overflow-hidden ${className}`}>
            <span className="opacity-0">
                {children}
            </span>
            <span className="absolute left-0 top-0 group-hover:-top-full group-hover:opacity-0 duration-300 delay-50">
                {children}
            </span>
            <span className="absolute left-0 top-full group-hover:top-0 duration-300 delay-50">
                {children}
            </span>
        </div>
    );
}
