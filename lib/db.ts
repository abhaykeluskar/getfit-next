"use client";

import Dexie, { Table } from "dexie";
import { WorkoutLog, LifestyleLog } from "./types";

export class GetFitDatabase extends Dexie {
  workoutLogs!: Table<WorkoutLog, number>;
  lifestyleLogs!: Table<LifestyleLog, number>;

  constructor() {
    super("GetFitDB");

    this.version(1).stores({
      workoutLogs:
        "++id, userId, [userId+date], [userId+synced], date, synced, pbId, updatedAt",
      lifestyleLogs:
        "++id, userId, [userId+date], [userId+synced], date, synced, pbId, updatedAt",
    });
  }
}

export const db = new GetFitDatabase();
