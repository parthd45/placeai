"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
  KanbanSquare,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-[#2D7F62]/20">
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-32">
              <Image
                src="/Skilli-Logo-Vector.svg"
                alt="Skilli"
                fill
                priority
                className="object-contain dark:brightness-110"
              />
            </div>
            <span className="hidden sm:inline-block rounded-md bg-[#2D7F62]/10 px-2 py-0.5 text-xs font-semibold text-[#1b7056] dark:text-emerald-400">
              IMCC Capstone Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl bg-[#1b7056] hover:bg-[#155a45] text-white px-4 py-2 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col items-center text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#2D7F62]/30 bg-[#2D7F62]/10 px-3.5 py-1 text-xs font-bold text-[#1b7056] dark:text-emerald-400">
          <Sparkles className="h-3.5 w-3.5 text-[#2D7F62]" />
          <span>Unified IMCC Academic Project Management & Mentorship</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl leading-tight">
          Manage, Collaborate, and Defend Academic{" "}
          <span className="text-[#2D7F62] dark:text-emerald-400">Capstone Projects</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          The unified Skilli portal designed for MES IMCC College capstone management, phase deliverables, rubric-based faculty evaluations, and agile sprint boards.
        </p>

        {/* Quick Launch Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#1b7056] hover:bg-[#155a45] text-white px-6 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <span>Open Capstone Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/auth/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <GraduationCap className="h-4 w-4 text-[#1b7056] dark:text-emerald-400" />
            <span>Student Registration (Roll No)</span>
          </Link>

          <Link
            href="/auth/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span>Institutional Sign In</span>
          </Link>
        </div>

        {/* 3 Role Persona Cards */}
        <div className="w-full pt-12 text-left">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Interactive Multi-Role Architecture
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Switch seamlessly between all institutional personas directly inside the dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-6 space-y-4 hover:border-[#2D7F62] transition-colors">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold">Student Capstone Workspace</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Track deliverables, upload phase reports, manage agile sprint cards, view live rubrics, and collaborate with team members.
              </p>
              <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Interactive Kanban Board (5 stages)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Phase Deliverables & Zip Uploads</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Official Viva Score Breakdown (91/100)</span>
                </li>
              </ul>
            </div>

            {/* Faculty Guide Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-6 space-y-4 hover:border-blue-500 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <UserCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold">Faculty Mentor Portal</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Inspect code repositories, review milestone submissions, grade criteria against official rubrics, and request revisions.
              </p>
              <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                  <span>Pending Submissions Review Queue</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                  <span>One-Click Approve / Request Revision</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                  <span>Supervised Teams Progress Matrix</span>
                </li>
              </ul>
            </div>

            {/* Dean Admin Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-6 space-y-4 hover:border-amber-500 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold">Department & Dean Console</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Oversee 84 capstone projects, balance guide allocations, verify roll numbers, and export accreditation compliance reports.
              </p>
              <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />
                  <span>Cohort-wide KPI & Progress Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />
                  <span>Faculty Allocation & Workload Balancing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />
                  <span>Instant CSV Accreditation Data Export</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© 2026 Skilli Platform Inc. • Built for MES IMCC Capstone Projects</div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-400">DPDP Act 2023 Compliant</span>
            <Link href="/auth/login" className="hover:text-emerald-600 transition-colors">
              Login
            </Link>
            <Link href="/auth/register" className="hover:text-emerald-600 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
