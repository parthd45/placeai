"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CheckCircle2,
  KanbanSquare,
  Award,
  GitBranch,
  Users2,
  ShieldCheck,
  FolderGit2,
  FileText,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import { UserRole, ProjectData } from "@/lib/types";

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  progressPercentage: number;
  project?: ProjectData | null;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
}

export function Sidebar({
  currentRole,
  activeTab,
  onTabChange,
  progressPercentage,
  project,
}: SidebarProps) {
  // Real dynamic badges calculated from actual project state
  const completedMilestones = project?.milestones.filter((m) => m.status === "COMPLETED").length || 0;
  const currentMilestone = project?.milestones.find((m) => m.status !== "COMPLETED") || project?.milestones[0];
  const milestoneBadge = currentMilestone ? currentMilestone.phase.split(":")[0].trim() : `${completedMilestones}/5`;
  const tasksBadge = project ? `${project.tasks.length} Tasks` : "0 Tasks";
  const assignedScore = project?.rubricCriteria?.reduce((s, c) => s + (c.assignedScore || 0), 0) || 0;
  const rubricsBadge = assignedScore > 0 ? `${assignedScore}/100` : "Pending";
  const teamBadge = project ? `${project.teamMembers.length}/4` : "1/4";

  const studentNavItems: NavItem[] = [
    { id: "overview", label: "Project Cockpit", icon: LayoutDashboard },
    { id: "milestones", label: "Milestones & Submissions", icon: CheckCircle2, badge: milestoneBadge },
    { id: "kanban", label: "Taskboard (Kanban)", icon: KanbanSquare, badge: tasksBadge },
    { id: "rubrics", label: "Evaluation & Rubrics", icon: Award, badge: rubricsBadge },
    { id: "team", label: "Team & Guides", icon: Users2, badge: teamBadge },
    { id: "docs", label: "IEEE / Synopsis Docs", icon: FileText, badge: "Docs" },
  ];

  const mentorNavItems: NavItem[] = [
    { id: "mentor-submissions", label: "Submissions Review Queue", icon: CheckCircle2, badge: "Review" },
    { id: "mentor-teams", label: "Supervised Teams", icon: Users2, badge: "Teams" },
    { id: "mentor-rubric", label: "Viva Grading Rubrics", icon: Award },
    { id: "mentor-schedule", label: "Viva Calendar", icon: CalendarDays },
  ];

  const adminNavItems: NavItem[] = [
    { id: "admin-analytics", label: "Cohort Analytics", icon: LayoutDashboard },
    { id: "admin-allocation", label: "Mentor-Team Matrix", icon: Users2 },
    { id: "admin-rubrics-config", label: "Grading Criteria Config", icon: Award },
    { id: "admin-reports", label: "Annual Accreditation Reports", icon: FileText },
  ];

  const itemsToRender: NavItem[] =
    currentRole === "STUDENT"
      ? studentNavItems
      : currentRole === "MENTOR"
      ? mentorNavItems
      : adminNavItems;

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 transition-colors">
      <div className="space-y-6">
        {/* Workspace Title */}
        <div className="px-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {currentRole === "STUDENT"
              ? "Capstone Workspace"
              : currentRole === "MENTOR"
              ? "Faculty Mentorship"
              : "Institutional Administration"}
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {currentRole === "STUDENT" ? "SY MCA 2026 Batch" : "MES IMCC Autonomous"}
            </span>
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              Active
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {itemsToRender.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#1b7056] text-white shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Capstone Project Snapshot Card (For Student view) */}
        {currentRole === "STUDENT" && project && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                Capstone Progress
              </span>
              <span className="text-xs font-extrabold text-[#1b7056] dark:text-emerald-400">
                {progressPercentage}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#1b7056] dark:bg-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>{completedMilestones} of 5 Milestones</span>
              <span>{project.teamMembers.length} Scholars</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer institutional and DPDP act acknowledgement */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-4 px-2 space-y-2 text-[11px] text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
          <ShieldCheck className="h-4 w-4 text-[#1b7056] dark:text-emerald-400" />
          <span>MES IMCC Autonomous</span>
        </div>
        <div className="text-[10px] leading-tight">
          MCA Capstone Defense Portal • Academic Year 2024-2026
        </div>
      </div>
    </aside>
  );
}
