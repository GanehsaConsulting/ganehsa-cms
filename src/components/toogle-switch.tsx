"use client";

import * as React from "react";
import { TbMoonFilled, TbSunFilled } from "react-icons/tb";

interface ToggleSwitchProps {
  isExpanded?: boolean;
  value?: "active" | "inactive";
  onChange?: (val: "active" | "inactive") => void;
}

export function ToggleSwitch({
  isExpanded = false,
  value = "inactive",
  onChange,
}: ToggleSwitchProps) {
  const toggle = () => onChange?.(value === "active" ? "inactive" : "active");

  return (
    <div
      className={`flex flex-col gap-2 w-full transition-all duration-300 ${
        !isExpanded ? "tooltip tooltip-right" : ""
      }`}
    >
      {/* Compact Mode */}
      <button
        type="button"
        onClick={toggle}
        className={`
          ${isExpanded && "hidden"} 
          flex items-center justify-center
          w-10 h-10 mx-auto rounded-full 
          bg-white/10 hover:bg-white/30
          dark:bg-black/20 dark:hover:bg-black/40
          transition-all duration-300
        `}
      >
        {value === "active" ? (
          <TbSunFilled className="text-xl text-yellow-400" />
        ) : (
          <TbMoonFilled className="text-xl text-blue-400" />
        )}
      </button>

      {/* Expanded Mode */}
      <div
        className={`
    ${!isExpanded && "hidden"} 
    relative grid grid-cols-2
    rounded-full overflow-hidden
    transition-all duration-300
  `}
      >
        {/* Indicator */}
        <div
          className={`
      absolute inset-0 grid grid-cols-2
      transition-transform duration-300 ease-in-out
    `}
        >
          <div
            className={`
        rounded-full  bg-mainColor/50 dark:bg-secondaryColor/80
        transition-transform duration-300 ease-in-out
        ${value === "inactive" ? "translate-x-full" : "translate-x-0"}
      `}
          />
        </div>

        {/* Active Button */}
        <button
          type="button"
          onClick={() => onChange?.("active")}
          className={`relative z-10 py-2 px-6 t text-sm font-semibold text-center
      ${
        value === "active"
          ? "text-lightColor dark:text-darkColor"
          : "text-lightColor/60 dark:text-darkColor/60"
      }
    `}
        >
          Active
        </button>

        {/* Inactive Button */}
        <button
          type="button"
          onClick={() => onChange?.("inactive")}
          className={`relative z-10 py-2 text-sm font-semibold text-center
      ${
        value === "inactive"
          ? "text-white dark:text-lightColor"
          : "text-darkColor/60 dark:text-lightColor/60"
      }
    `}
        >
          Inactive
        </button>
      </div>
    </div>
  );
}
