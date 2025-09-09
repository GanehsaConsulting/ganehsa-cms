"use client"

import { Wrapper } from "@/components/wrapper";
import Link from "next/link";
import { BiMessageAltError } from "react-icons/bi";
import { useSidebar } from "@/app/contexts/sidebar-context";
import { useEffect, useState } from "react";

export default function NotFound() {
    const { isExpanded } = useSidebar();
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);
    
    // Fallback untuk SSR - gunakan default collapsed state
    const sidebarMargin = isClient ? (isExpanded ? "ml-64" : "ml-[79px]") : "ml-[79px]";
    
    return (
        <div className="absolute inset-0 z-50">
            <Wrapper 
                className={`${sidebarMargin} transition-all duration-300 flex items-center justify-center`} 
                withHeader="h-[calc(100vh-1rem)]"
            >
                <div className="text-center text-white p-8 max-w-md mx-auto">
                    <div className="mb-8">
                        <p className="flex items-center justify-center text-5xl opacity-30">
                            <BiMessageAltError />
                        </p>
                        <h1 className="text-9xl font-bold opacity-20 mb-4">404</h1>
                        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
                        <p className="text-lightColor/70 mb-8">
                            The page you are looking for might have been removed,
                            had its name changed, or is temporarily unavailable.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/"
                            className="px-4 py-2 bg-mainColor hover:bg-mainColor/80 rounded-main text-sm font-medium transition-colors duration-200"
                        >
                            Go to Dashboard
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="px-4 py-2 border border-lightColor/30 hover:bg-white/10 rounded-main text-sm font-medium transition-colors duration-200"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </Wrapper>
        </div>
    );
}