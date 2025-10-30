"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1 dark:text-gray-300">
            {label}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
          {change && (
            <p
              className={`text-xs mt-1 ${
                trend === "up"
                  ? "text-green-600 dark:text-green-400"
                  : trend === "down"
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {change}
            </p>
          )}
        </div>
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center dark:bg-blue-700">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
        </div>
      </div>
    </div>
  );
}
