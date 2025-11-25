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
    header?: ReactNode; // Tambahkan prop untuk header
    headerClassName?: string; // Custom class untuk header
    useBaseClases?: boolean; // Custom class untuk header
};

export const Wrapper = ({
    children,
    className = "",
    flexGrow = true,
    scrollable = true,
    padding = "p-5",
    spacing = "space-y-4",
    margin = "my-2 mr-2",
    withHeader = "h-[calc(100vh-5rem)]",
    header,
    headerClassName = "",
    useBaseClases = true
}: WrapperProps) => {
    const baseClasses = `
        ${margin} 
        bg-lightColor/15 dark:bg-darkColor/40
        backdrop-blur-2xl
        mb-2
        rounded-main 
        shadow-mainShadow
        border border-lightColor/15 dark:border-darkColor/20
        relative
    `;

    const transparentClasses = `
        ${margin} 
        bg-transparent
        mb-2
        rounded-main 
        shadow-mainShadow
        relative
    `;

    const layoutClasses = `
        ${flexGrow ? 'flex-grow' : ''} 
        flex flex-col grow
    `;

    const scrollClasses = scrollable
        ? `overflow-y-auto no-scrollbar`
        : `overflow-hidden`;

    // Jika ada header, pisahkan struktur
    if (header) {
        return (
            <div className={`${useBaseClases && baseClasses}  ${layoutClasses} overflow-hidden ${className} ${withHeader}`}>
                {/* Header area - tidak scroll */}
                <div className={`flex-shrink-0 ${headerClassName}`}>
                    {header}
                </div>
                
                {/* Content area - bisa scroll */}
                <div className={`${scrollClasses} ${padding} ${spacing} flex-1`}>
                    {children}
                </div>
            </div>
        );
    }

    // Struktur default tanpa header
    return (
        <div className={`${useBaseClases ? baseClasses : transparentClasses } ${layoutClasses} ${scrollClasses} ${padding} ${spacing} ${className} ${withHeader}`}>
            {children}
        </div>
    );
};