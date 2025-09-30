"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import clsx from "clsx";
import { useHeaderStore } from "@/app/store/header-store";

export const Header = () => {
    const pathname = usePathname();
    const {
        leftActions,
        centerActions,
        rightActions,
        leftClassName,
        centerClassName,
        rightClassName,
        hideBreadcrumbs
    } = useHeaderStore();

    // Hide pada halaman khusus
    const noNavigation = ["/login", "/forgot-password", "/reset-password"];
    if (noNavigation.includes(pathname)) {
        return null;
    }

    // Fungsi untuk mengonversi path menjadi array breadcrumb
    const getBreadcrumbs = () => {
        if (pathname === "/") {
            return [{ label: "Dashboard", href: "/" }];
        }

        const pathArray = pathname.split("/").filter((x) => x);
        const breadcrumbs = [{ label: "Dashboard", href: "/" }];

        // Build breadcrumbs dari path segments
        pathArray.forEach((segment, index) => {
            const href = "/" + pathArray.slice(0, index + 1).join("/");
            const formattedSegment = segment.replace(/-/g, " ");

            // Skip segments yang terlalu panjang atau ID-like
            const isLongId =
                segment.length >= 10 &&
                /[a-zA-Z]/.test(segment) &&
                /[0-9]/.test(segment);
            const isTrxCode = segment.startsWith("TRX-");

            if (!isLongId && !isTrxCode) {
                breadcrumbs.push({
                    label: formattedSegment,
                    href,
                });
            }
        });

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <header className="rounded-main mt-2 mr-2 w-auto h-14 flex-shrink-0 bg-lightColor/15 dark:bg-darkColor/40 backdrop-blur-2xl shadow-mainShadow border border-lightColor/15 dark:border-darkColor/20">
            <nav className="w-full h-full flex items-center px-4">
                <div className="flex items-center justify-between w-full relative">
                    {/* Left Section: Breadcrumbs + Left Actions */}
                    <div className="flex items-center gap-4">

                        {/* Left Actions - muncul di sebelah breadcrumbs */}
                        {leftActions && (
                            <div className={clsx("flex items-center gap-4", leftClassName)}>
                                {leftActions}
                            </div>
                        )}

                        {/* Breadcrumbs - hide jika hideBreadcrumbs = true */}
                        {!hideBreadcrumbs && (
                            <nav className="flex items-center text-sm">
                                {breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={crumb.href}>
                                        {index > 0 && (
                                            <span className="mx-2 text-lightColor/50">
                                                <IoIosArrowForward />
                                            </span>
                                        )}
                                        <Link
                                            href={crumb.href}
                                            className={`capitalize transition-colors duration-200 
                                                ${index === 0
                                                    ? "text-lightColor font-semibold hover:text-lightColor/80"
                                                    : index === breadcrumbs.length - 1
                                                        ? "text-white font-semibold"
                                                        : "text-lightColor/70 hover:text-lightColor font-medium"
                                                } `}
                                        >
                                            {crumb.label}
                                        </Link>
                                    </React.Fragment>
                                ))}
                            </nav>
                        )}


                    </div>

                    {/* Center Actions - absolute positioned */}
                    {centerActions && (
                        <div
                            className={clsx(
                                "flex items-center gap-4 absolute left-1/2 -translate-x-1/2",
                                centerClassName
                            )}
                        >
                            {centerActions}
                        </div>
                    )}

                    {/* Right Actions */}
                    {rightActions && (
                        <div className={clsx("flex items-center gap-4", rightClassName)}>
                            {rightActions}
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};