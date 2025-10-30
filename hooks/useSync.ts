"use client";

import { useState, useEffect, useCallback } from "react";
import { SyncService } from "@/lib/sync";
import type { SyncStatus } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

export function useSync() {
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSyncTime: null,
    pendingWorkouts: 0,
    pendingLifestyle: 0,
    isSyncing: false,
    lastSyncError: null,
  });
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Only check status if user is authenticated
    if (!user) {
      setSyncStatus((prev) => ({
        ...prev,
        pendingWorkouts: 0,
        pendingLifestyle: 0,
      }));
      return;
    }

    const checkStatus = async () => {
      try {
        // Pass userId to getSyncStatus
        const status = await SyncService.getSyncStatus(user.id);
        setSyncStatus((prev) => ({
          ...prev,
          pendingWorkouts: status.pendingWorkouts,
          pendingLifestyle: status.pendingLifestyle,
        }));
      } catch (error) {
        console.error("Failed to check sync status:", error);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline || !user) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        performSync();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const syncInterval = setInterval(() => {
      performSync();
    }, 5 * 60 * 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(syncInterval);
    };
  }, [isOnline, user]);

  const performSync = useCallback(async () => {
    if (syncStatus.isSyncing || !user) return;

    setSyncStatus((prev) => ({
      ...prev,
      isSyncing: true,
      lastSyncError: null,
    }));

    try {
      const result = await SyncService.syncAll();

      setSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date().toISOString(),
        lastSyncError: result.success ? null : result.errors.join(", "),
        pendingWorkouts: 0,
        pendingLifestyle: 0,
      }));

      return result;
    } catch (error: any) {
      setSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncError: error.message,
      }));
    }
  }, [syncStatus.isSyncing, user]);

  return {
    syncStatus,
    isOnline,
    performSync,
  };
}
