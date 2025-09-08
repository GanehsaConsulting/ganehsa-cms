"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type SidebarContextType = {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  sidebarWidth: number;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

type SidebarProviderProps = {
  children: ReactNode;
};

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Calculate sidebar width based on expanded state
  const sidebarWidth = isExpanded ? 256 : 79; // 256px expanded, 79px collapsed

  useEffect(() => {
    // Load saved state from localStorage
    const storedExpanded = localStorage.getItem("isExpanded");
    if (storedExpanded !== null) {
      setIsExpanded(JSON.parse(storedExpanded));
    }
  }, []);

  const handleSetIsExpanded = (expanded: boolean) => {
    setIsExpanded(expanded);
    localStorage.setItem("isExpanded", JSON.stringify(expanded));
  };

  return (
    <SidebarContext.Provider 
      value={{ 
        isExpanded, 
        setIsExpanded: handleSetIsExpanded, 
        sidebarWidth 
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};