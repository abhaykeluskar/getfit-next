"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import type { LifestyleLog } from "@/lib/types";

export function useLifestyle() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LifestyleLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLogs([]);
      setIsLoading(false);
      return;
    }

    const loadLogs = async () => {
      try {
        const lifestyleLogs = await db.lifestyleLogs
          .where("userId")
          .equals(user.id)
          .reverse()
          .sortBy("date");
        setLogs(lifestyleLogs);
      } catch (error) {
        console.error("Failed to load lifestyle logs", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, [user]);

  const addLog = async (
    data: Omit<
      LifestyleLog,
      "id" | "userId" | "synced" | "version" | "createdAt" | "updatedAt"
    >
  ) => {
    if (!user) return;

    const now = new Date().toISOString();
    const log: LifestyleLog = {
      ...data,
      userId: user.id,
      synced: false,
      version: 0,
      createdAt: now,
      updatedAt: now,
    };

    const id = await db.lifestyleLogs.add(log);
    setLogs((prev) => [{ ...log, id }, ...prev]);
  };

  const updateLog = async (id: number, updates: Partial<LifestyleLog>) => {
    const existing = await db.lifestyleLogs.get(id);
    if (!existing) return;

    await db.lifestyleLogs.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
      synced: false,
      version: existing.version + 1,
    });

    setLogs((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  const deleteLog = async (id: number) => {
    await db.lifestyleLogs.delete(id);
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  return {
    logs,
    isLoading,
    addLog,
    updateLog,
    deleteLog,
  };
}
