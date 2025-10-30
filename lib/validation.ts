import { z } from 'zod';

export const ExerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name required'),
  sets: z.number().int().min(1).max(20),
  reps: z.number().int().min(1).max(100),
  weight: z.number().min(0).max(1000),
  notes: z.string().optional(),
});

export const WorkoutLogSchema = z.object({
  userId: z.string(),
  date: z.string().datetime(),
  phase: z.string().min(1),
  day: z.number().int().positive(),
  exercises: z.array(ExerciseSchema).min(1),
  duration: z.number().int().min(0).optional(),
  notes: z.string().max(500).optional(),
  synced: z.boolean(),
  pbId: z.string().optional(),
  updatedAt: z.string().datetime(),
  version: z.number().int().min(0),
  createdAt: z.string().datetime(),
});

export const LifestyleLogSchema = z.object({
  userId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sleepHours: z.number().min(0).max(24),
  sleepQuality: z.union([
    z.literal(1), z.literal(2), z.literal(3), 
    z.literal(4), z.literal(5)
  ]),
  stressLevel: z.union([
    z.literal(1), z.literal(2), z.literal(3), 
    z.literal(4), z.literal(5)
  ]),
  ateWell: z.boolean(),
  alcohol: z.boolean(),
  smoking: z.boolean(),
  heatAvoidance: z.boolean(),
  waterIntake: z.number().min(0).max(20).optional(),
  notes: z.string().max(500).optional(),
  synced: z.boolean(),
  pbId: z.string().optional(),
  updatedAt: z.string().datetime(),
  version: z.number().int().min(0),
  createdAt: z.string().datetime(),
});