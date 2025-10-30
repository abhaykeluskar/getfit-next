"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkouts } from "@/hooks/useWorkouts";
import Navigation from "@/components/Navigation";
import type { Exercise } from "@/lib/types";
import { Plus, Trash2, Save, X } from "lucide-react";

export default function NewWorkoutPage() {
  const router = useRouter();
  const { addWorkout } = useWorkouts();
  const [phase, setPhase] = useState("");
  const [day, setDay] = useState(1);
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: "", sets: 3, reps: 10, weight: 0, notes: "" },
  ]);
  const [duration, setDuration] = useState<number | undefined>();
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addExercise = () => {
    setExercises([
      ...exercises,
      { name: "", sets: 3, reps: 10, weight: 0, notes: "" },
    ]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addWorkout(phase, day, exercises, duration, notes);
      router.push("/workouts");
    } catch (error) {
      console.error("Failed to add workout", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />

      <main className="pb-20 md:pt-20 md:pb-8">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Log Workout
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-200">
              Record your training session details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Info
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phase"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phase/Program
                  </label>
                  <input
                    id="phase"
                    type="text"
                    value={phase}
                    onChange={(e) => setPhase(e.target.value)}
                    required
                    placeholder="e.g., Hypertrophy, Strength"
                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="day"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Day Number
                  </label>
                  <input
                    id="day"
                    type="number"
                    value={day}
                    onChange={(e) => setDay(parseInt(e.target.value))}
                    required
                    min="1"
                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Duration (minutes)
                  </label>
                  <input
                    id="duration"
                    type="number"
                    value={duration || ""}
                    onChange={(e) =>
                      setDuration(
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    min="1"
                    placeholder="Optional"
                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Exercises Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Exercises
                </h2>
                <button
                  type="button"
                  onClick={addExercise}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Exercise
                </button>
              </div>

              <div className="space-y-4">
                {exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Exercise {index + 1}
                      </span>
                      {exercises.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExercise(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Exercise name"
                        value={exercise.name}
                        onChange={(e) =>
                          updateExercise(index, "name", e.target.value)
                        }
                        required
                        className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Sets
                          </label>
                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) =>
                              updateExercise(
                                index,
                                "sets",
                                parseInt(e.target.value)
                              )
                            }
                            required
                            min="1"
                            className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Reps
                          </label>
                          <input
                            type="number"
                            value={exercise.reps}
                            minLength={0}
                            onChange={(e) =>
                              updateExercise(
                                index,
                                "reps",
                                parseInt(e.target.value)
                              )
                            }
                            required
                            min="1"
                            className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            value={exercise.weight}
                            minLength={0}
                            onChange={(e) =>
                              updateExercise(
                                index,
                                "weight",
                                parseFloat(e.target.value)
                              )
                            }
                            required
                            min="0"
                            step="0.5"
                            className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Notes (optional)"
                        value={exercise.notes}
                        onChange={(e) =>
                          updateExercise(index, "notes", e.target.value)
                        }
                        className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Workout Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="How did you feel? Any observations?"
                className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Saving..." : "Save Log"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-500 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-100" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
