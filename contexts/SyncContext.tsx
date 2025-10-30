"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSync } from "@/hooks/useSync";
import type { SyncStatus } from "@/lib/types";

interface SyncContextType {
  syncStatus: SyncStatus;
  isOnline: boolean;
  performSync: () => Promise<any>;
}

const SyncContext = createContext<SyncContextType | null>(null);

export function SyncProvider({ children }: { children: ReactNode }) {
  const syncData = useSync();

  return (
    <SyncContext.Provider value={syncData}>{children}</SyncContext.Provider>
  );
}

export const useSyncContext = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("useSyncContext must be used within SyncProvider");
  }
  return context;
};
