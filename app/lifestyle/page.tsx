"use client";

import { useLifestyle } from "@/hooks/useLifestyle";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import EmptyState from "@/components/EmptyState";
import {
  Activity,
  Plus,
  Calendar,
  Moon,
  Zap,
  Utensils,
  Wine,
  Cigarette,
  Flame,
  Droplets,
  Check,
  X,
} from "lucide-react";

export default function LifestylePage() {
  const { logs, isLoading } = useLifestyle();

  return (
    <>
      <Navigation />

      <main className="pb-20 md:pt-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Lifestyle Logs
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-200 mt-1">
                {logs.length} daily logs tracked
              </p>
            </div>
            <Link
              href="/lifestyle/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Log
            </Link>
          </div>

          {/* Logs List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-green-600 border-t-transparent mx-auto"></div>
            </div>
          ) : logs.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No lifestyle logs yet"
              description="Start tracking your daily habits and lifestyle metrics"
              actionLabel="Create log"
              actionHref="/lifestyle/new"
            />
          ) : (
            <div className="grid gap-4">
              {logs.map((log) => (
                <Link
                  key={log.id}
                  href={`/lifestyle/${log.id}`}
                  className="block bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(log.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    {!log.synced && (
                      <span className="inline-block text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                        Not synced
                      </span>
                    )}
                  </div>

                  {/* Sleep & Stress */}
                  <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Moon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Sleep</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {log.sleepHours}h
                          <span className="text-xs text-gray-500 ml-1">
                            (Q: {log.sleepQuality}/5)
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Stress</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {log.stressLevel}/5
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Habits Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        log.ateWell ? "text-green-700" : "text-gray-400"
                      }`}
                    >
                      {log.ateWell ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <Utensils className="w-4 h-4" />
                      <span>Diet</span>
                    </div>

                    <div
                      className={`flex items-center gap-2 text-sm ${
                        !log.alcohol ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      {!log.alcohol ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <Wine className="w-4 h-4" />
                      <span>No Alcohol</span>
                    </div>

                    <div
                      className={`flex items-center gap-2 text-sm ${
                        !log.smoking ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      {!log.smoking ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <Cigarette className="w-4 h-4" />
                      <span>No Smoking</span>
                    </div>

                    <div
                      className={`flex items-center gap-2 text-sm ${
                        log.heatAvoidance ? "text-green-700" : "text-gray-400"
                      }`}
                    >
                      {log.heatAvoidance ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <Flame className="w-4 h-4" />
                      <span>Heat Avoided</span>
                    </div>
                  </div>

                  {log.waterIntake && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                      <Droplets className="w-4 h-4 text-blue-600" />
                      <span>{log.waterIntake}L water</span>
                    </div>
                  )}

                  {log.notes && (
                    <p className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600 italic">
                      {log.notes}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
