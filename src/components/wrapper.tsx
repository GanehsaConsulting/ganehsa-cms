"use client"
import { ReactNode } from "react";

type WrapperProps = {
    children?: ReactNode;
    className?: string;
    flexGrow?: boolean;
    scrollable?: boolean;
    padding?: string;
    spacing?: string;
    margin?: string;
    withHeader?: string;
};

export const Wrapper = ({
    children,
    className = "",
    flexGrow = true,
    scrollable = true,
    padding = "p-4",
    spacing = "space-y-4",
    margin = "my-2 mr-2",
    withHeader = "h-[calc(100vh-5rem)]"
}: WrapperProps) => {
    const baseClasses = `
        ${margin} 
        bg-lightColor/15 dark:bg-darkColor/40
        mb-2
        backdrop-blur-2xl
        rounded-main 
        ${padding} 
        ${spacing} 
        shadow-mainShadow
        border border-lightColor/15 dark:border-darkColor/20
    `;

    const layoutClasses = `
        ${flexGrow ? 'flex-grow' : ''} 
        flex flex-col grow

    `;

    const scrollClasses = scrollable
        ? `overflow-y-auto no-scrollbar`
        : `overflow-hidden`;

    return (
        <div className={`${baseClasses} ${layoutClasses} ${scrollClasses} ${className} ${withHeader}`}
        >
            {children}
        </div>
    );
};