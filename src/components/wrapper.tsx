"use client"
import { useSidebar } from "@/app/contexts/sidebar-context";
import { ReactNode } from "react";

type WrapperProps = {
    children?: ReactNode;
    className?: string;
    heightOffset?: string;
    flexGrow?: boolean;
    scrollable?: boolean;
    padding?: string;
    spacing?: string;
    margin?: string;
    leftOffset?: string;
};

export const Wrapper = ({
    children,
    className = "",
    heightOffset = "16px",
    flexGrow = true,
    scrollable = true,
    padding = "p-5",
    spacing = "space-y-5",
    margin = "m-2",
}: WrapperProps) => {
    const { sidebarWidth } = useSidebar(); // Get dynamic sidebar width

    const baseClasses = `
        ${margin} 
        bg-white/20 dark:bg-black/20
        backdrop-blur-2xl
        rounded-main 
        ${padding} 
        ${spacing} 
        shadow-mainShadow
        border border-white/20 dark:border-black/20
    `;

    const layoutClasses = `
        ${flexGrow ? 'flex-grow' : ''} 
        flex flex-col
    `;

    const scrollClasses = scrollable
        ? `overflow-y-scroll no-scrollbar`
        : `overflow-hidden`;

    // Position absolute with full viewport calculations
    const positionClasses = `
        absolute 
        top-0 
        right-0
        z-10
        transition-all
        duration-300
    `;

    // Dynamic width calculation based on sidebar state
    const marginOffset = margin.includes('mx-') ? '16px' : '8px';
    const heightStyle = {
        height: `calc(100vh - ${heightOffset})`,
        maxHeight: `calc(100vh - ${heightOffset})`,
        width: `calc(100vw - ${sidebarWidth}px - ${marginOffset})`
    };

    return (
        <div
            className={`w-full ${baseClasses} ${layoutClasses} ${scrollClasses} ${positionClasses} ${className}`}
            style={heightStyle}
        >
            {children}
        </div>
    );
};