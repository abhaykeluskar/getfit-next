export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

export interface WorkoutLog {
  id?: number;
  userId: string;
  date: string;
  phase: string;
  day: number;
  exercises: Exercise[];
  duration?: number;
  notes?: string;
  synced: boolean | number; // Support both boolean and 0/1 for IndexedDB
  pbId?: string;
  updatedAt: string;
  version: number;
  createdAt: string;
}

export interface LifestyleLog {
  id?: number;
  userId: string;
  date: string;
  sleepHours: number;
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  stressLevel: 1 | 2 | 3 | 4 | 5;
  ateWell: boolean;
  alcohol: boolean;
  smoking: boolean;
  heatAvoidance: boolean;
  waterIntake?: number;
  notes?: string;
  synced: boolean | number; // Support both boolean and 0/1 for IndexedDB
  pbId?: string;
  updatedAt: string;
  version: number;
  createdAt: string;
}

export interface SyncStatus {
  lastSyncTime: string | null;
  pendingWorkouts: number;
  pendingLifestyle: number;
  isSyncing: boolean;
  lastSyncError: string | null;
}

export interface SyncConflict {
  id: number;
  type: "workout" | "lifestyle";
  localVersion: WorkoutLog | LifestyleLog;
  serverVersion: WorkoutLog | LifestyleLog;
  resolvedBy?: "local" | "server" | "user";
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  created: string;
  updated: string;
}
