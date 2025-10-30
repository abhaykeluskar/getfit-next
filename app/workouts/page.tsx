"use client";

import { useWorkouts } from "@/hooks/useWorkouts";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import EmptyState from "@/components/EmptyState";
import { Dumbbell, Plus, Calendar, Clock } from "lucide-react";

export default function WorkoutsPage() {
  const { workouts, isLoading } = useWorkouts();

  return (
    <>
      <Navigation />

      <main className="pb-20 md:pt-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Workouts
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-200 mt-1">
                {workouts.length} total workouts logged
              </p>
            </div>
            <Link
              href="/workouts/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Workout
            </Link>
          </div>

          {/* Workouts List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto"></div>
            </div>
          ) : workouts.length === 0 ? (
            <EmptyState
              icon={Dumbbell}
              title="No workouts yet"
              description="Start tracking your fitness journey by logging your first workout"
              actionLabel="Log workout"
              actionHref="/workouts/new"
            />
          ) : (
            <div className="grid gap-4">
              {workouts.map((workout) => (
                <Link
                  key={workout.id}
                  href={`/workouts/${workout.id}`}
                  className="block bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Dumbbell className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {workout.phase}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Day {workout.day}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(workout.date).toLocaleDateString()}
                      </div>
                      {!workout.synced && (
                        <span className="inline-block text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                          Not synced
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>{workout.exercises.length} exercises</span>
                      {workout.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {workout.duration} min
                        </div>
                      )}
                    </div>

                    {workout.exercises.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {workout.exercises.slice(0, 3).map((exercise, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded"
                          >
                            {exercise.name}
                          </span>
                        ))}
                        {workout.exercises.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{workout.exercises.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
