"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserRole, StudentUser } from "@/lib/types";
import {
  Bell,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeView: string;
  user?: StudentUser | null;
}

export function Navbar({ currentRole, onRoleChange, activeView, user }: NavbarProps) {
  const [isDark, setIsDark] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(1);

  useEffect(() => {
    // Default to dark mode like Skilli
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const userName = user?.name || "Parth Deshmukh";
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Skilli/PlaceAI Logo */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <div className="relative h-8 w-28">
              <Image
                src="/Skilli-Logo-Vector.svg"
                alt="PlaceAI PMS"
                fill
                priority
                className="object-contain brightness-110"
              />
            </div>
          </Link>
        </div>

        {/* Center: Batch & Division Badge */}
        <div className="hidden md:flex items-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 border border-slate-700/50 px-4 py-1.5 text-xs font-medium text-slate-300">
            <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-semibold text-white">Batch 26-28</span>
            <span className="text-slate-500">/</span>
            <span>FY MCA</span>
            <span className="text-slate-500 font-bold">•</span>
            <span>Div A</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4 text-slate-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setUnreadNotifications(0)}
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-sm">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 rounded-lg border border-slate-700/50 bg-slate-900/50 px-2.5 py-1.5 hover:bg-slate-800 transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold">
                {userInitials}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white leading-none">
                  {userName}
                </div>
                <div className="text-[10px] text-slate-500 leading-none mt-0.5">
                  Student
                </div>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-500" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50">
                <div className="px-3 py-2 border-b border-slate-800 space-y-1">
                  <div className="font-bold text-xs text-white">{userName}</div>
                  <div className="text-[11px] text-slate-500 truncate">{user?.email || "parth.deshmukh@mesimcc.edu.in"}</div>
                  <div className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                    Roll No: {user?.rollNumber || "2401089"} • {user?.division || "Div A"}
                  </div>
                </div>

                <div className="py-1">
                  <a
                    href="/dashboard.html"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Return to PlaceAI Profile</span>
                  </a>
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950/30 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
