import * as React from "react"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

const SearchInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
  return (
    <div className="relative w-full">
      {/* Icon di kiri input */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="text-muted-foreground h-5 w-5" />
      </div>
      
      <input
        type="text"
        placeholder="Search..."
        className={cn(
          "h-9 w-full rounded-third border border-lightColor/10 dark:border-darkColor/10 bg-lightColor/50 dark:bg-darkColor/50 px-10 py-2 text-base shadow-xs placeholder:text-darkColor/50 dark:placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] selection:bg-primary selection:text-primary-foreground outline-none disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { SearchInput }
