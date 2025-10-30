"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import type { WorkoutLog, Exercise } from "@/lib/types";

export function useWorkouts() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWorkouts([]);
      setIsLoading(false);
      return;
    }

    const loadWorkouts = async () => {
      try {
        const logs = await db.workoutLogs
          .where("userId")
          .equals(user.id)
          .reverse()
          .sortBy("date");
        setWorkouts(logs);
      } catch (error) {
        console.error("Failed to load workouts", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkouts();
  }, [user]);

  const addWorkout = async (
    phase: string,
    day: number,
    exercises: Exercise[],
    duration?: number,
    notes?: string
  ) => {
    if (!user) return;

    const now = new Date().toISOString();
    const workout: WorkoutLog = {
      userId: user.id,
      date: now,
      phase,
      day,
      exercises,
      duration,
      notes,
      synced: false,
      version: 0,
      createdAt: now,
      updatedAt: now,
    };

    const id = await db.workoutLogs.add(workout);
    setWorkouts((prev) => [{ ...workout, id }, ...prev]);
  };

  const updateWorkout = async (id: number, updates: Partial<WorkoutLog>) => {
    const existing = await db.workoutLogs.get(id);
    if (!existing) return;

    await db.workoutLogs.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
      synced: false,
      version: existing.version + 1,
    });

    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
  };

  const deleteWorkout = async (id: number) => {
    await db.workoutLogs.delete(id);
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  return {
    workouts,
    isLoading,
    addWorkout,
    updateWorkout,
    deleteWorkout,
  };
}
