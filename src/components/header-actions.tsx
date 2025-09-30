// components/header/HeaderActions.tsx
"use client";

import { useHeaderStore } from "@/app/store/header-store";
import { ReactNode, useEffect } from "react";

interface HeaderActionsProps {
  children: ReactNode;
  position?: "left" | "center" | "right";
  className?: string;
  hideBreadcrumbs?: boolean;
}

export const HeaderActions = ({ 
  children, 
  position = "right",
  className = "",
  hideBreadcrumbs = false 
}: HeaderActionsProps) => {
  const { setLeftActions, setCenterActions, setRightActions, setHideBreadcrumbs } = useHeaderStore();

  useEffect(() => {
    // Set actions berdasarkan position
    if (position === "left") {
      setLeftActions(children, className);
    } else if (position === "center") {
      setCenterActions(children, className);
    } else {
      setRightActions(children, className);
    }

    // Set hideBreadcrumbs jika ada
    if (hideBreadcrumbs) {
      setHideBreadcrumbs(true);
    }
    
    // Cleanup hanya untuk position yang spesifik ini
    return () => {
      if (position === "left") {
        setLeftActions(null);
      } else if (position === "center") {
        setCenterActions(null);
      } else {
        setRightActions(null);
      }
      
      // Reset hideBreadcrumbs hanya jika component ini yang set
      if (hideBreadcrumbs) {
        setHideBreadcrumbs(false);
      }
    };
  }, [children, position, className, hideBreadcrumbs, setLeftActions, setCenterActions, setRightActions, setHideBreadcrumbs]);

  // Component ini tidak render apa-apa, hanya set state
  return null;
};