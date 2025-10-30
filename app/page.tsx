"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useSyncContext } from "@/contexts/SyncContext";
import Link from "next/link";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useLifestyle } from "@/hooks/useLifestyle";
import Navigation from "@/components/Navigation";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import { signOut } from "@/lib/pocketbase";
import {
  Dumbbell,
  Activity,
  TrendingUp,
  Calendar,
  Plus,
  Wifi,
  WifiOff,
  RefreshCw,
  LogOut,
} from "lucide-react";

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const { syncStatus, isOnline, performSync } = useSyncContext();
  const { workouts, isLoading: workoutsLoading } = useWorkouts();
  const { logs: lifestyleLogs, isLoading: lifestyleLoading } = useLifestyle();
  const handleLogout = async () => {
    await signOut();
    window.location.href = "/auth/login";
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-gray-800 dark:text-gray-100">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-200 mb-2">Get Fit</h1>
          <p className="text-gray-400 mb-8">
            Track your workouts and lifestyle with ease
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  const totalWorkouts = workouts.length;
  const totalLifestyleLogs = lifestyleLogs.length;
  const thisWeekWorkouts = workouts.filter((w) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(w.date) > weekAgo;
  }).length;

  return (
    <>
      <Navigation />

      <main className="pb-20 md:pt-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Welcome back, {user.name || user.email.split("@")[0]}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-200 mt-1">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Sync Status */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                    isOnline
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {isOnline ? (
                    <Wifi className="w-3.5 h-3.5" />
                  ) : (
                    <WifiOff className="w-3.5 h-3.5" />
                  )}
                  {isOnline ? "Online" : "Offline"}
                </div>

                {isOnline && (
                  <button
                    onClick={() => performSync()}
                    disabled={syncStatus.isSyncing}
                    className="p-2 bg-orange-500 text-gray-100 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                    title="Sync now"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${
                        syncStatus.isSyncing ? "animate-spin" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>

            {syncStatus.pendingWorkouts + syncStatus.pendingLifestyle > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-full p-3 text-sm text-yellow-800">
                {syncStatus.pendingWorkouts + syncStatus.pendingLifestyle} items
                pending sync
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Dumbbell}
              label="Total Workouts"
              value={totalWorkouts}
            />
            <StatCard
              icon={Activity}
              label="Lifestyle Logs"
              value={totalLifestyleLogs}
            />
            <StatCard
              icon={Calendar}
              label="This Week"
              value={thisWeekWorkouts}
              change={
                thisWeekWorkouts > 0
                  ? `${thisWeekWorkouts} workouts`
                  : "No workouts"
              }
              trend={thisWeekWorkouts > 2 ? "up" : "neutral"}
            />
            <StatCard icon={TrendingUp} label="Streak" value="0" />
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Link
              href="/workouts/new"
              className="group flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Dumbbell className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Log Workout
                </h3>
                <p className="text-sm text-gray-600">
                  Record your training session
                </p>
              </div>
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
            </Link>

            <Link
              href="/lifestyle/new"
              className="group flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-sm transition-all"
            >
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Log Lifestyle
                </h3>
                <p className="text-sm text-gray-600">Track your daily habits</p>
              </div>
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Workouts */}
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Recent Workouts
                </h2>
                <Link
                  href="/workouts"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </Link>
              </div>

              {workoutsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto"></div>
                </div>
              ) : workouts.length === 0 ? (
                <EmptyState
                  icon={Dumbbell}
                  title="No workouts yet"
                  description="Start tracking your fitness journey"
                  actionLabel="Log workout"
                  actionHref="/workouts/new"
                />
              ) : (
                <div className="space-y-3">
                  {workouts.slice(0, 5).map((workout) => (
                    <Link
                      key={workout.id}
                      href={`/workouts/${workout.id}`}
                      className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {workout.phase}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Day {workout.day}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(workout.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {workout.exercises.length} exercises
                        {workout.duration && ` • ${workout.duration} min`}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Lifestyle Logs */}
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Recent Lifestyle
                </h2>
                <Link
                  href="/lifestyle"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </Link>
              </div>

              {lifestyleLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto"></div>
                </div>
              ) : lifestyleLogs.length === 0 ? (
                <EmptyState
                  icon={Activity}
                  title="No logs yet"
                  description="Start tracking your daily habits"
                  actionLabel="Log lifestyle"
                  actionHref="/lifestyle/new"
                />
              ) : (
                <div className="space-y-3">
                  {lifestyleLogs.slice(0, 5).map((log) => (
                    <Link
                      key={log.id}
                      href={`/lifestyle/${log.id}`}
                      className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs text-gray-500">
                          {new Date(log.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-600">
                          Sleep:{" "}
                          <span className="font-medium text-gray-900">
                            {log.sleepHours}h
                          </span>
                        </div>
                        <div className="text-gray-600">
                          Stress:{" "}
                          <span className="font-medium text-gray-900">
                            {log.stressLevel}/5
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={handleLogout}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white font-medium rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-4"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
