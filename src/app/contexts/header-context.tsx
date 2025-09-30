"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface HeaderContextType {
  headerActions: ReactNode;
  setHeaderActions: (actions: ReactNode) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [headerActions, setHeaderActions] = useState<ReactNode>(null);

  return (
    <HeaderContext.Provider value={{ headerActions, setHeaderActions }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within HeaderProvider");
  }
  return context;
};

// Custom hook yang auto cleanupπ
export const useHeaderActions = (actions: ReactNode) => {
  const { setHeaderActions } = useHeader();

  useEffect(() => {
    setHeaderActions(actions);
    return () => setHeaderActions(null);
  }, [actions, setHeaderActions]);
};