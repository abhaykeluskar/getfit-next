"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useLifestyle } from "@/hooks/useLifestyle";
import Navigation from "@/components/Navigation";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Calendar, Activity, Moon, Zap } from "lucide-react";
import { useMemo } from "react";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { workouts } = useWorkouts();
  const { logs } = useLifestyle();

  // Prepare workout frequency data (last 7 days)
  const workoutFrequencyData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    return last7Days.map((date) => {
      const count = workouts.filter((w) => w.date.startsWith(date)).length;
      return {
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        workouts: count,
      };
    });
  }, [workouts]);

  // Prepare exercise volume data (total sets per exercise type)
  const exerciseVolumeData = useMemo(() => {
    const exerciseCounts: Record<string, number> = {};

    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exerciseCounts[exercise.name] =
          (exerciseCounts[exercise.name] || 0) + exercise.sets;
      });
    });

    return Object.entries(exerciseCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, sets]) => ({ name, sets }));
  }, [workouts]);

  // Prepare sleep quality data (last 7 days)
  const sleepData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    return last7Days.map((date) => {
      const log = logs.find((l) => l.date === date);
      return {
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        hours: log?.sleepHours || 0,
        quality: log?.sleepQuality || 0,
      };
    });
  }, [logs]);

  // Prepare lifestyle habits pie chart
  const lifestyleHabitsData = useMemo(() => {
    if (logs.length === 0) return [];

    const goodDiet = logs.filter((l) => l.ateWell).length;
    const noAlcohol = logs.filter((l) => !l.alcohol).length;
    const noSmoking = logs.filter((l) => !l.smoking).length;
    const heatAvoided = logs.filter((l) => l.heatAvoidance).length;

    return [
      { name: "Good Diet", value: (goodDiet / logs.length) * 100 },
      { name: "No Alcohol", value: (noAlcohol / logs.length) * 100 },
      { name: "No Smoking", value: (noSmoking / logs.length) * 100 },
      { name: "Heat Avoided", value: (heatAvoided / logs.length) * 100 },
    ];
  }, [logs]);

  const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];

  if (!user) return null;

  return (
    <>
      <Navigation />

      <main className="pb-20 md:pt-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-sm text-gray-600">
              Track your progress and insights
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>Total Workouts</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {workouts.length}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <Calendar className="w-4 h-4" />
                <span>This Week</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {
                  workouts.filter((w) => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(w.date) > weekAgo;
                  }).length
                }
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <Activity className="w-4 h-4" />
                <span>Lifestyle Logs</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <Moon className="w-4 h-4" />
                <span>Avg Sleep</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {logs.length > 0
                  ? (
                      logs.reduce((sum, l) => sum + l.sleepHours, 0) /
                      logs.length
                    ).toFixed(1)
                  : 0}
                h
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Workout Frequency Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Workout Frequency
              </h3>
              {workouts.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={workoutFrequencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="workouts"
                      fill="#4f46e5"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  No workout data yet
                </div>
              )}
            </div>

            {/* Exercise Volume Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Exercises
              </h3>
              {exerciseVolumeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={exerciseVolumeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="sets" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  No exercise data yet
                </div>
              )}
            </div>

            {/* Sleep Tracking Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sleep Tracking
              </h3>
              {logs.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={sleepData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", r: 4 }}
                      name="Sleep Hours"
                    />
                    <Line
                      type="monotone"
                      dataKey="quality"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: "#8b5cf6", r: 4 }}
                      name="Quality (1-5)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  No sleep data yet
                </div>
              )}
            </div>

            {/* Lifestyle Habits Pie Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Healthy Habits
              </h3>
              {lifestyleHabitsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={lifestyleHabitsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) =>
                        `${name}: ${(value as any).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {lifestyleHabitsData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `${value.toFixed(1)}%`}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  No lifestyle data yet
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
