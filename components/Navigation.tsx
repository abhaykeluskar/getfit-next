"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Dumbbell,
  Activity,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/pocketbase";

export default function Navigation() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/auth/login";
  };

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/workouts", icon: Dumbbell, label: "Workouts" },
    { href: "/lifestyle", icon: Activity, label: "Lifestyle" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:top-0 md:bottom-auto md:border-b md:border-t-0 z-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Desktop only */}
          <div className="hidden md:flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-lg">Get Fit</span>
          </div>

          {/* Nav Items */}
          <div className="flex items-center justify-around md:justify-center md:gap-1 w-full md:w-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col md:flex-row items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "text-gray-200 bg-blue-50 dark:bg-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs md:text-sm font-medium">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* User Menu - Desktop only */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
