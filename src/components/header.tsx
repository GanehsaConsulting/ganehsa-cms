"use client"

export const Header = () => {
    return (
        <header className="rounded-main mt-2 mr-2 w-auto h-14 flex-shrink-0 bg-lightColor/15 dark:bg-darkColor/40 backdrop-blur-2xl shadow-mainShadow border border-lightColor/15 dark:border-darkColor/20">
            <nav className="w-full h-full flex items-center px-6">
                {/* Header content goes here */}
                <div className="flex items-center justify-between w-full">
                    <div>
                        <h1 className="text-lg font-semibold text-lightColor">
                            Dashboard
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Add header actions here */}
                    </div>
                </div>
            </nav>
        </header>
    );
};