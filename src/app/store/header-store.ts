// store/headerStore.ts
import { create } from "zustand";
import { ReactNode } from "react";

interface HeaderStore {
  leftActions: ReactNode;
  centerActions: ReactNode;
  rightActions: ReactNode;
  leftClassName: string;
  centerClassName: string;
  rightClassName: string;
  hideBreadcrumbs: boolean;
  setLeftActions: (actions: ReactNode, className?: string) => void;
  setCenterActions: (actions: ReactNode, className?: string) => void;
  setRightActions: (actions: ReactNode, className?: string) => void;
  setHideBreadcrumbs: (hide: boolean) => void;
  clearActions: () => void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  leftActions: null,
  centerActions: null,
  rightActions: null,
  leftClassName: "",
  centerClassName: "",
  rightClassName: "",
  hideBreadcrumbs: false,
  setLeftActions: (actions, className = "") => 
    set({ leftActions: actions, leftClassName: className }),
  setCenterActions: (actions, className = "") => 
    set({ centerActions: actions, centerClassName: className }),
  setRightActions: (actions, className = "") => 
    set({ rightActions: actions, rightClassName: className }),
  setHideBreadcrumbs: (hideBreadcrumbs) => set({ hideBreadcrumbs }),
  clearActions: () => set({ 
    leftActions: null, 
    centerActions: null, 
    rightActions: null,
    leftClassName: "",
    centerClassName: "",
    rightClassName: "",
    hideBreadcrumbs: false 
  }),
}));