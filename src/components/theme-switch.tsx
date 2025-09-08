"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { TbMoonFilled, TbSunFilled } from "react-icons/tb";

interface ThemeSwitchProps {
  isExpanded: boolean;
}

export const ThemeSwitch = ({ isExpanded }: ThemeSwitchProps) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
    setCurrentTheme(resolvedTheme);
  }, [resolvedTheme]);

  // Update state saat tema berubah
  useEffect(() => {
    if (mounted) {
      setCurrentTheme(resolvedTheme);
    }
  }, [resolvedTheme, mounted]);

  // Render placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className={`flex flex-col gap-2 w-full transition-all duration-300 ${!isExpanded ? "tooltip tooltip-right" : ""}`}
      >
        {/* Minimize Mode Placeholder */}
        <button
          className={`
            ${isExpanded && "hidden"} 
            flex items-center justify-center
            w-10 h-10 mx-auto
            rounded-full 
            bg-white/10 hover:bg-white/30
            dark:bg-black/10 dark:hover:bg-black/30
            relative overflow-hidden
            transition-all duration-300
            group
          `}
        >
          <TbSunFilled className="text-lg text-lightColor dark:text-darkColor" />
        </button>

        {/* Expand Mode Placeholder */}
        <div
          className={`
            ${!isExpanded && "hidden"} 
            flex items-center gap-0 p-1 
            dark:bg-white/15 hover:dark:bg-white/30
            bg-black/10 hover:bg-black/30
            rounded-full
            relative overflow-hidden
            transition-all duration-300
            w-full
            min-h-[20px]
          `}
        >
          <button
            className="duration-300 flex-1 z-20 flex items-center justify-center py-1.5 px-1.5 rounded-secondary transition-all min-w-0 max-w-none text-lightColor dark:text-darkColor"
          >
            <TbSunFilled className="text-sm flex-shrink-0" />
          </button>
          <button
            className="duration-300 flex-1 z-20 flex items-center justify-center py-1.5 px-1.5 rounded-secondary transition-all min-w-0 max-w-none text-lightColor/60 dark:text-darkColor/60"
          >
            <TbMoonFilled className="text-sm flex-shrink-0" />
          </button>
          <div className="absolute z-10 h-[calc(100%-8px)] w-[calc(50%-6px)] bg-mainColor/50 dark:bg-secondaryColor rounded-full transition-all duration-300 ease-in-out top-1 left-1" />
        </div>
      </div>
    );
  }

  return (
    <div
      data-tip="Theme"
      className={`flex flex-col gap-2 w-full transition-all duration-300 ${!isExpanded ? "tooltip tooltip-right" : ""}`}
    >
      {/* Minimize Mode - Compact button to match profile layout */}
      <button
        onClick={() => setTheme(currentTheme === "light" ? "dark" : "light")}
        className={`
          ${isExpanded && "hidden"} 
          flex items-center justify-center
          w-10 h-10 mx-auto
          rounded-full 
          bg-white/10 hover:bg-white/30
          dark:bg-black/10 dark:hover:bg-black/30
          relative overflow-hidden
          transition-all duration-300
          group
        `}
      >
        {/* Icon Dark Mode */}
        <div
          className={`
            ${currentTheme === "light" ? "-translate-y-[200%] opacity-0" : "translate-y-0 opacity-100"} 
            transition-all duration-500 
            absolute inset-0
            flex items-center justify-center
            text-darkColor dark:text-lightColor
          `}
        >
          <TbMoonFilled className="text-lg" />
        </div>

        {/* Icon Light Mode */}
        <div
          className={`
            ${currentTheme === "dark" ? "translate-y-[200%] opacity-0" : "translate-y-0 opacity-100"} 
            transition-all duration-500 
            absolute inset-0
            flex items-center justify-center
            text-lightColor dark:text-darkColor
          `}
        >
          <TbSunFilled className="text-lg" />
        </div>
      </button>

      {/* Expand Mode - Horizontal toggle to match profile width */}
      <div
        className={`
          ${!isExpanded && "hidden"} 
          flex items-center gap-0 p-1 
          dark:bg-white/15 hover:dark:bg-white/30
          bg-black/10 hover:bg-black/30
          rounded-full
          relative overflow-hidden
          transition-all duration-300
          w-full
          min-h-[20px]
        `}
      >
        {/* Light Mode Button */}
        <button
          className={`
            duration-300 flex-1 z-20 
            flex items-center justify-center 
            py-1.5 px-1.5 rounded-secondary
            transition-all
            min-w-0 max-w-none
            ${currentTheme === 'light'
              ? 'text-lightColor dark:text-darkColor'
              : 'text-lightColor/60 dark:text-darkColor/60 hover:text-lightColor dark:hover:text-darkColor'
            }
          `}
          onClick={() => setTheme("light")}
        >
          <TbSunFilled className="text-sm flex-shrink-0" />
        </button>

        {/* Dark Mode Button */}
        <button
          className={`
            duration-300 flex-1 z-20 
            flex items-center justify-center 
            py-1.5 px-1.5 rounded-secondary
            transition-all 
            min-w-0 max-w-none
            ${currentTheme === 'dark'
              ? 'text-darkColor dark:text-lightColor'
              : 'text-darkColor/60 dark:text-lightColor/60 hover:text-lightColor dark:hover:text-darkColor'
            }
          `}
          onClick={() => setTheme("dark")}
        >
          <TbMoonFilled className="text-sm flex-shrink-0" />
        </button>

        {/* Sliding Background Indicator */}
        <div
          className={`
            absolute z-10 
            h-[calc(100%-8px)] w-[calc(50%-6px)]
            bg-mainColor/50 dark:bg-secondaryColor
            rounded-full 
            transition-all duration-300 ease-in-out
            top-1 left-1
            ${currentTheme === 'dark'
              ? 'translate-x-[calc(100%+4px)]'
              : 'translate-x-0'
            }
          `}
        />
      </div>
    </div>
  );
};