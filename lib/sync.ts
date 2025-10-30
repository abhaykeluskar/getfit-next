"use client";

import { db } from "./db";
import { pb } from "./pocketbase";
import type { WorkoutLog, LifestyleLog, SyncConflict } from "./types";
import { Logger } from "./logger";

interface SyncResult {
  success: boolean;
  workoutsSynced: number;
  lifestyleSynced: number;
  conflicts: SyncConflict[];
  errors: string[];
}

export class SyncService {
  private static isSyncing = false;
  private static MAX_RETRIES = 3;
  private static RETRY_DELAY = 1000;

  static async syncAll(): Promise<SyncResult> {
    if (this.isSyncing) {
      return {
        success: false,
        workoutsSynced: 0,
        lifestyleSynced: 0,
        conflicts: [],
        errors: ["Sync already in progress"],
      };
    }

    this.isSyncing = true;
    const result: SyncResult = {
      success: true,
      workoutsSynced: 0,
      lifestyleSynced: 0,
      conflicts: [],
      errors: [],
    };

    try {
      if (!pb.authStore.isValid) {
        throw new Error("Not authenticated");
      }

      if (!(await this.checkConnectivity())) {
        throw new Error("No network connection");
      }

      const workoutResult = await this.syncWorkouts();
      result.workoutsSynced = workoutResult.synced;
      result.conflicts.push(...workoutResult.conflicts);
      result.errors.push(...workoutResult.errors);

      const lifestyleResult = await this.syncLifestyle();
      result.lifestyleSynced = lifestyleResult.synced;
      result.conflicts.push(...lifestyleResult.conflicts);
      result.errors.push(...lifestyleResult.errors);

      result.success = result.errors.length === 0;
    } catch (error: any) {
      result.success = false;
      result.errors.push(error.message);
      Logger.error("Sync failed", error);
    } finally {
      this.isSyncing = false;
    }

    return result;
  }

  private static async syncWorkouts() {
    const result = {
      synced: 0,
      conflicts: [] as SyncConflict[],
      errors: [] as string[],
    };

    try {
      const unsyncedWorkouts = await db.workoutLogs
        .where("synced")
        .equals(0)
        .toArray();

      for (const workout of unsyncedWorkouts) {
        try {
          await this.syncWorkoutWithRetry(workout);
          result.synced++;
        } catch (error: any) {
          result.errors.push(`Workout ${workout.id}: ${error.message}`);
        }
      }
    } catch (error: any) {
      result.errors.push(error.message);
    }

    return result;
  }

  private static async syncWorkoutWithRetry(
    workout: WorkoutLog,
    retries = 0
  ): Promise<void> {
    try {
      if (workout.pbId) {
        await this.updateWorkout(workout);
      } else {
        await this.createWorkout(workout);
      }
    } catch (error: any) {
      if (retries < this.MAX_RETRIES) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.RETRY_DELAY * Math.pow(2, retries))
        );
        return this.syncWorkoutWithRetry(workout, retries + 1);
      }
      throw error;
    }
  }

  private static async createWorkout(workout: WorkoutLog): Promise<void> {
    const record = await pb.collection("workout_logs").create({
      userId: workout.userId,
      date: workout.date,
      phase: workout.phase,
      day: workout.day,
      exercises: workout.exercises,
      duration: workout.duration,
      notes: workout.notes,
      version: workout.version,
    });

    await db.workoutLogs.update(workout.id!, {
      synced: true,
      pbId: record.id,
    });
  }

  private static async updateWorkout(workout: WorkoutLog): Promise<void> {
    try {
      const serverRecord = await pb
        .collection("workout_logs")
        .getOne(workout.pbId!);

      if (serverRecord.version > workout.version) {
        await this.resolveWorkoutConflict(workout, serverRecord);
      } else {
        await pb.collection("workout_logs").update(workout.pbId!, {
          date: workout.date,
          phase: workout.phase,
          day: workout.day,
          exercises: workout.exercises,
          duration: workout.duration,
          notes: workout.notes,
          version: workout.version + 1,
        });

        await db.workoutLogs.update(workout.id!, {
          synced: true,
          version: workout.version + 1,
        });
      }
    } catch (error: any) {
      throw error;
    }
  }

  private static async resolveWorkoutConflict(
    local: WorkoutLog,
    server: any
  ): Promise<void> {
    const localTime = new Date(local.updatedAt).getTime();
    const serverTime = new Date(server.updated).getTime();

    if (localTime > serverTime) {
      await pb.collection("workout_logs").update(local.pbId!, {
        date: local.date,
        phase: local.phase,
        day: local.day,
        exercises: local.exercises,
        duration: local.duration,
        notes: local.notes,
        version: server.version + 1,
      });

      await db.workoutLogs.update(local.id!, {
        synced: true,
        version: server.version + 1,
      });
    } else {
      await db.workoutLogs.update(local.id!, {
        date: server.date,
        phase: server.phase,
        day: server.day,
        exercises: server.exercises,
        duration: server.duration,
        notes: server.notes,
        version: server.version,
        synced: true,
        updatedAt: server.updated,
      });
    }
  }

  private static async syncLifestyle() {
    const result = {
      synced: 0,
      conflicts: [] as SyncConflict[],
      errors: [] as string[],
    };

    try {
      const unsyncedLogs = await db.lifestyleLogs
        .where("synced")
        .equals(0)
        .toArray();

      for (const log of unsyncedLogs) {
        try {
          await this.syncLifestyleWithRetry(log);
          result.synced++;
        } catch (error: any) {
          result.errors.push(`Lifestyle ${log.id}: ${error.message}`);
        }
      }
    } catch (error: any) {
      result.errors.push(error.message);
    }

    return result;
  }

  private static async syncLifestyleWithRetry(
    log: LifestyleLog,
    retries = 0
  ): Promise<void> {
    try {
      if (log.pbId) {
        await this.updateLifestyle(log);
      } else {
        await this.createLifestyle(log);
      }
    } catch (error: any) {
      if (retries < this.MAX_RETRIES) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.RETRY_DELAY * Math.pow(2, retries))
        );
        return this.syncLifestyleWithRetry(log, retries + 1);
      }
      throw error;
    }
  }

  private static async createLifestyle(log: LifestyleLog): Promise<void> {
    const record = await pb.collection("lifestyle_logs").create({
      userId: log.userId,
      date: log.date,
      sleepHours: log.sleepHours,
      sleepQuality: log.sleepQuality,
      stressLevel: log.stressLevel,
      ateWell: log.ateWell,
      alcohol: log.alcohol,
      smoking: log.smoking,
      heatAvoidance: log.heatAvoidance,
      waterIntake: log.waterIntake,
      notes: log.notes,
      version: log.version,
    });

    await db.lifestyleLogs.update(log.id!, {
      synced: true,
      pbId: record.id,
    });
  }

  private static async updateLifestyle(log: LifestyleLog): Promise<void> {
    try {
      const serverRecord = await pb
        .collection("lifestyle_logs")
        .getOne(log.pbId!);

      if (serverRecord.version > log.version) {
        await this.resolveLifestyleConflict(log, serverRecord);
      } else {
        await pb.collection("lifestyle_logs").update(log.pbId!, {
          date: log.date,
          sleepHours: log.sleepHours,
          sleepQuality: log.sleepQuality,
          stressLevel: log.stressLevel,
          ateWell: log.ateWell,
          alcohol: log.alcohol,
          smoking: log.smoking,
          heatAvoidance: log.heatAvoidance,
          waterIntake: log.waterIntake,
          notes: log.notes,
          version: log.version + 1,
        });

        await db.lifestyleLogs.update(log.id!, {
          synced: true,
          version: log.version + 1,
        });
      }
    } catch (error: any) {
      throw error;
    }
  }

  private static async resolveLifestyleConflict(
    local: LifestyleLog,
    server: any
  ): Promise<void> {
    const localTime = new Date(local.updatedAt).getTime();
    const serverTime = new Date(server.updated).getTime();

    if (localTime > serverTime) {
      await pb.collection("lifestyle_logs").update(local.pbId!, {
        date: local.date,
        sleepHours: local.sleepHours,
        sleepQuality: local.sleepQuality,
        stressLevel: local.stressLevel,
        ateWell: local.ateWell,
        alcohol: local.alcohol,
        smoking: local.smoking,
        heatAvoidance: local.heatAvoidance,
        waterIntake: local.waterIntake,
        notes: local.notes,
        version: server.version + 1,
      });

      await db.lifestyleLogs.update(local.id!, {
        synced: true,
        version: server.version + 1,
      });
    } else {
      await db.lifestyleLogs.update(local.id!, {
        ...server,
        synced: true,
        updatedAt: server.updated,
      });
    }
  }

  private static async checkConnectivity(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      await fetch(pb.baseUrl + "/api/health", {
        method: "HEAD",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return true;
    } catch {
      return false;
    }
  }

  // FIXED: Accept optional userId parameter to avoid querying all records
  static async getSyncStatus(userId?: string) {
    try {
      // If no userId provided, return zeros (user not authenticated)
      if (!userId) {
        return {
          pendingWorkouts: 0,
          pendingLifestyle: 0,
          total: 0,
        };
      }

      // Query by userId AND synced status to avoid invalid key range
      const pendingWorkouts = await db.workoutLogs
        .where("[userId+synced]")
        .equals([userId, 0])
        .count();

      const pendingLifestyle = await db.lifestyleLogs
        .where("[userId+synced]")
        .equals([userId, 0])
        .count();

      return {
        pendingWorkouts,
        pendingLifestyle,
        total: pendingWorkouts + pendingLifestyle,
      };
    } catch (error) {
      console.error("Error getting sync status:", error);
      return {
        pendingWorkouts: 0,
        pendingLifestyle: 0,
        total: 0,
      };
    }
  }
}
