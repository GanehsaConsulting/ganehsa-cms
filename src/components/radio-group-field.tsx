
"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import clsx from "clsx";

interface RadioOption {
  label: string;
  value?: string;
  color?: "green" | "red" | "yellow" | "blue" | "orange" | "purple" | "pink" | "gray" | "indigo" | "cyan";
}

interface RadioGroupFieldProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  className?: string;
  containerClassName?: string;
  inactiveStyle?: string;
  orientation?: "horizontal" | "vertical";
}

// Simple color mapping
const COLOR_STYLES: Record<string, string> = {
  green: "text-white border-green-600/20 bg-green-500/80",
  red: "text-white border-red-600/20 bg-red-500/80",
  yellow: "text-white border-yellow-600/20 bg-yellow-500/80",
  blue: "text-white border-blue-600/20 bg-blue-500/80",
  orange: "text-white border-orange-600/20 bg-orange-500/80",
  purple: "text-white border-purple-600/20 bg-purple-500/80",
  pink: "text-white border-pink-600/20 bg-pink-500/80",
  gray: "text-white border-gray-600/20 bg-gray-500/80",
  indigo: "text-white border-indigo-600/20 bg-indigo-500/80",
  cyan: "text-white border-cyan-600/20 bg-cyan-500/80",
};

// Default styles untuk common values (fallback)
const DEFAULT_VALUE_COLORS: Record<string, string> = {
  // Status
  draft: "yellow",
  pending: "yellow",
  review: "orange",
  approved: "blue",
  published: "green",
  active: "green",
  inactive: "gray",
  archived: "gray",
  
  // Priority
  critical: "red",
  urgent: "red",
  high: "orange",
  medium: "yellow",
  normal: "blue",
  low: "blue",
  
  // State
  success: "green",
  error: "red",
  warning: "yellow",
  info: "blue",
  danger: "red",
  
  // Boolean
  yes: "green",
  no: "red",
  enabled: "green",
  disabled: "gray",
  online: "green",
  offline: "gray",
};

export const RadioGroupField = ({
  id = "radio-group",
  label,
  value,
  onChange,
  options,
  className = "",
  containerClassName = "",
  inactiveStyle = "bg-darkColor/0 dark:bg-lightColor/0 border-lightColor/0 dark:border-darkColor/0 text-darkColor/50 dark:text-muted-foreground hover:bg-neutral-700/20 dark:hover:bg-neutral-200/20",
  orientation = "horizontal",
}: RadioGroupFieldProps) => {
  return (
    <div className={clsx("grid w-full items-center gap-3", containerClassName)}>
      {/* Label */}
      {label && <Label className="text-white">{label}</Label>}

      {/* Radio Group */}
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={clsx(
          "flex gap-[5px] p-1 bg-lightColor/50 dark:bg-darkColor/50 rounded-third w-fit",
          orientation === "vertical" && "flex-col rounded-lg",
          className
        )}
      >
        {options.map((opt) => {
          const isActive = value === opt.value;
          
          // Determine active style dari color
          let activeStyle = "text-white border-blue-500 bg-blue-500/20"; // default
          
          if (isActive) {
            // Priority: explicit color prop > default value mapping
            const colorToUse =
              opt.color ||
              (typeof opt.value === "string"
                ? DEFAULT_VALUE_COLORS[opt.value.toLowerCase()]
                : undefined);
            
            if (colorToUse && COLOR_STYLES[colorToUse]) {
              activeStyle = COLOR_STYLES[colorToUse];
            }
          }

          return (
            <Label
              key={opt.value}
              htmlFor={`${id}-${opt.value}`}
              className="cursor-pointer text-sm transition-all font-[400px] -ml-px first:ml-0"
            >
              <div
                className={clsx(
                  "px-4 py-1 border transition-all",
                  orientation === "horizontal" ? "rounded-fourth" : "rounded-lg",
                  isActive ? activeStyle : inactiveStyle
                )}
              >
                <RadioGroupItem
                  value={opt.value ?? ""}
                  id={`${id}-${opt.value}`}
                  className="hidden"
                />
                {opt.label}
              </div>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
};