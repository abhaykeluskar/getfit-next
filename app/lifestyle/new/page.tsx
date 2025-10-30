"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLifestyle } from "@/hooks/useLifestyle";
import Navigation from "@/components/Navigation";
import {
  Save,
  X,
  Moon,
  Zap,
  Utensils,
  Wine,
  Cigarette,
  Flame,
  Droplets,
} from "lucide-react";

export default function NewLifestylePage() {
  const router = useRouter();
  const { addLog } = useLifestyle();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [stressLevel, setStressLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [ateWell, setAteWell] = useState(true);
  const [alcohol, setAlcohol] = useState(false);
  const [smoking, setSmoking] = useState(false);
  const [heatAvoidance, setHeatAvoidance] = useState(true);
  const [waterIntake, setWaterIntake] = useState<number | undefined>(2);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addLog({
        date,
        sleepHours,
        sleepQuality,
        stressLevel,
        ateWell,
        alcohol,
        smoking,
        heatAvoidance,
        waterIntake,
        notes,
      });
      router.push("/lifestyle");
    } catch (error) {
      console.error("Failed to add lifestyle log", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingButton = ({
    value,
    currentValue,
    onClick,
  }: {
    value: number;
    currentValue: number;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2 rounded-full border-2 font-medium transition-colors ${
        currentValue === value
          ? "border-green-600 bg-green-50 text-green-700"
          : "border-gray-300 text-gray-600 hover:border-gray-400"
      }`}
    >
      {value}
    </button>
  );

  return (
    <>
      <Navigation />

      <main className="pb-20 md:pt-20 md:pb-8">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Log Daily Lifestyle
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-200">
              Track your sleep, stress, and daily habits
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Sleep Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Moon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Sleep</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="sleepHours"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Hours: {sleepHours}h
                  </label>
                  <input
                    id="sleepHours"
                    type="range"
                    min="0"
                    max="24"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <RatingButton
                        key={val}
                        value={val}
                        currentValue={sleepQuality}
                        onClick={() =>
                          setSleepQuality(val as 1 | 2 | 3 | 4 | 5)
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stress Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Stress Level
                </h2>
              </div>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <RatingButton
                    key={val}
                    value={val}
                    currentValue={stressLevel}
                    onClick={() => setStressLevel(val as 1 | 2 | 3 | 4 | 5)}
                  />
                ))}
              </div>
            </div>

            {/* Habits Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Daily Habits
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={ateWell}
                    onChange={(e) => setAteWell(e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <Utensils className="w-5 h-5 text-gray-400" />
                  <span className="flex-1 font-medium text-gray-900">
                    Ate Well Today
                  </span>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={alcohol}
                    onChange={(e) => setAlcohol(e.target.checked)}
                    className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                  />
                  <Wine className="w-5 h-5 text-gray-400" />
                  <span className="flex-1 font-medium text-gray-900">
                    Consumed Alcohol
                  </span>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={smoking}
                    onChange={(e) => setSmoking(e.target.checked)}
                    className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                  />
                  <Cigarette className="w-5 h-5 text-gray-400" />
                  <span className="flex-1 font-medium text-gray-900">
                    Smoked
                  </span>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={heatAvoidance}
                    onChange={(e) => setHeatAvoidance(e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <Flame className="w-5 h-5 text-gray-400" />
                  <span className="flex-1 font-medium text-gray-900">
                    Avoided Excessive Heat
                  </span>
                </label>
              </div>
            </div>

            {/* Water & Notes Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="waterIntake"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                  >
                    <Droplets className="w-4 h-4 text-blue-600" />
                    Water Intake (Liters)
                  </label>
                  <input
                    id="waterIntake"
                    type="number"
                    value={waterIntake || ""}
                    onChange={(e) =>
                      setWaterIntake(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    min="0"
                    step="0.1"
                    placeholder="Optional"
                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="How was your day? Any observations?"
                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
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
