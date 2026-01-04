import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { BorderBeam } from "./border-beam";

interface ScrollableListFrameProps extends React.HTMLAttributes<HTMLDivElement> {
    maxHeight?: string;
}

export function ScrollableListFrame({
    className,
    children,
    maxHeight = "max-h-[500px]",
    ...props
}: ScrollableListFrameProps) {
    return (

        <div
            className={cn(
                "relative rounded-xl border border-slate-700/50 bg-slate-900/30 backdrop-blur-sm overflow-hidden",
                "animate-in fade-in zoom-in-95 duration-500", // Entry animation for the frame itself
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    "overflow-y-auto w-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700/50 hover:scrollbar-thumb-slate-600 transition-colors",
                    maxHeight
                )}
            >
                <div className="flex flex-col gap-2 p-4">
                    {children}
                </div>
            </div>

            {/* Decorative gradient overlay at bottom to hint scrolling */}
            {/* <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent opacity-50" /> */}
            <BorderBeam
                duration={6}
                delay={2}
                size={4000}
                borderWidth={2}
                colorFrom="#3b82f6"
                colorTo="#06b6d4"
                className="from-transparent via-blue-500 to-cyan-500 [mask-image:linear-gradient(to_bottom,black,transparent)]"
            />
        </div>
    );
}
