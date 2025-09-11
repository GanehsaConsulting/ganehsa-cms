"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const BackgroundImage = () => {
    const pathname = usePathname();
    const is404 = pathname === "/404" || pathname.includes("/not-found");

    if (is404) {
        return (
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-mainColor/20 via-darkColor to-black flex items-center justify-center">
                <div className="text-center text-white p-8 max-w-md mx-auto">
                    <div className="mb-8">
                        <h1 className="text-9xl font-bold opacity-20 mb-4">404</h1>
                        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
                        <p className="text-lightColor/80 mb-8">
                            The page you are looking for might have been removed, 
                            had its name changed, or is temporarily unavailable.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="/"
                            className="px-6 py-3 bg-mainColor hover:bg-mainColor/80 rounded-lg font-medium transition-colors duration-200"
                        >
                            Go Home
                        </Link>
                        <button 
                            onClick={() => window.history.back()}
                            className="px-6 py-3 border border-lightColor/30 hover:bg-white/10 rounded-lg font-medium transition-colors duration-200"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-0">
            <Image
                src="https://images.unsplash.com/photo-1707655096635-89387f83f189?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Background"
                fill
                priority
                style={{ objectFit: "cover" }}
            />
            <div className="absolute inset-0 bg-black/35"></div>
        </div>
    );
};