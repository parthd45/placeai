"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserRole, StudentUser } from "@/lib/types";
import {
  Bell,
  Search,
  Moon,
  Sun,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Sparkles,
  ChevronDown,
  LogOut,
  ExternalLink,
} from "lucide-react";

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeView: string;
  user?: StudentUser | null;
}

export function Navbar({ currentRole, onRoleChange, activeView, user }: NavbarProps) {
  const [isDark, setIsDark] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  useEffect(() => {
    // Check saved theme or system preference
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
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

  const getRoleDetails = (role: UserRole) => {
    switch (role) {
      case "STUDENT":
        return {
          title: "Student View",
          badge: "Aarav Sharma • 2401098 (SY MCA)",
          icon: GraduationCap,
          color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
        };
      case "MENTOR":
        return {
          title: "Mentor / Faculty View",
          badge: "Dr. Shrikant Joshi • Associate Prof.",
          icon: UserCheck,
          color: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
        };
      case "DEPARTMENT_ADMIN":
      case "ORGANIZATION_ADMIN":
        return {
          title: "Dean / Admin View",
          badge: "Prof. P. Deshpande • HOD MCA",
          icon: ShieldCheck,
          color: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
        };
      default:
        return {
          title: "Student View",
          badge: "Scholar Roster",
          icon: GraduationCap,
          color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
        };
    }
  };

  const roleInfo = getRoleDetails(currentRole);
  const RoleIcon = roleInfo.icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Branding & College Banner */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="relative h-8 w-28 sm:w-32">
              <Image
                src="/Skilli-Logo-Vector.svg"
                alt="Skilli Platform"
                fill
                priority
                className="object-contain dark:brightness-110"
              />
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#2D7F62]/10 dark:bg-[#2D7F62]/20 px-2 py-0.5 text-xs font-semibold text-[#1b7056] dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2D7F62] animate-pulse"></span>
              IMCC Capstone PMS
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">2026 Academic Cohort</span>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search deliverables, tasks, roll numbers, or rubrics..."
              className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 pl-9 pr-12 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/30 focus:border-[#2D7F62] transition-colors"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Role Switcher & User Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Interactive Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all shadow-2xs ${roleInfo.color}`}
            >
              <RoleIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline font-bold">{roleInfo.title}</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-50">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Persona
                </div>
                <div className="space-y-1 mt-1">
                  <button
                    onClick={() => {
                      onRoleChange("STUDENT");
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                      currentRole === "STUDENT"
                        ? "bg-[#2D7F62]/10 text-[#1b7056] dark:text-emerald-400 font-bold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="font-semibold">Student Dashboard</div>
                      <div className="text-[10px] text-slate-400">Manage Capstone & Tasks</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onRoleChange("MENTOR");
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                      currentRole === "MENTOR"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="font-semibold">Faculty / Mentor Portal</div>
                      <div className="text-[10px] text-slate-400">Review Milestones & Rubrics</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onRoleChange("DEPARTMENT_ADMIN");
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                      currentRole === "DEPARTMENT_ADMIN"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <div>
                      <div className="font-semibold">Dean / Admin Console</div>
                      <div className="text-[10px] text-slate-400">Cohort & Workload Analytics</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setUnreadNotifications(0)}
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>

          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 p-1 pr-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-[#1b7056] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                {(user?.name || "Parth Deshmukh")
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "PD"}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-semibold leading-none text-slate-900 dark:text-white">
                  {user?.name ? user.name.split(" ")[0] + (user.name.split(" ")[1] ? " " + user.name.split(" ")[1][0] + "." : "") : "Parth D."}
                </div>
                <div className="text-[10px] text-slate-500 leading-none mt-0.5">
                  {user?.rollNumber || "2401089"}
                </div>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{user?.name || "Parth Deshmukh"}</span>
                    {user?.isPlaceAiAuth && (
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/20">
                        SSO
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{user?.email || "parth.deshmukh@mesimcc.edu.in"}</div>
                  <div className="inline-flex items-center gap-1 rounded bg-[#2D7F62]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#1b7056] dark:text-emerald-400">
                    {user?.department ? (user.department.length > 25 ? user.department.slice(0, 25) + "..." : user.department) : "Department of Computer Applications (MCA)"} • {user?.division || "Div A"}
                  </div>
                </div>

                <div className="py-1">
                  <a
                    href="/dashboard.html"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Return to PlaceAI Profile</span>
                  </a>
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out / Switch Session</span>
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
