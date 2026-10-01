"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  Users2,
  CalendarDays,
  FileText,
  Search,
  BarChart3,
  BookOpen,
  Plug,
  GitBranch,
  LayoutGrid,
  ShieldCheck,
  Briefcase,
  ChevronLeft,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { UserRole, ProjectData } from "@/lib/types";

function FigmaIcon({ className = "h-4 w-4 shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
      <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
      <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
      <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
      <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
    </svg>
  );
}

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
  const [collapsed, setCollapsed] = useState(false);

  // Dynamic badges from real project data
  const taskCount = project?.tasks?.length || 0;

  const studentNavItems: NavItem[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "tasks", label: "My Tasks", icon: CheckSquare },
    { id: "mentorship", label: "Mentorship", icon: Users2 },
    { id: "calendar", label: "Calendar", icon: CalendarDays },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "research", label: "Research", icon: Search },
    { id: "resources", label: "Academic Resources", icon: BarChart3 },
    { id: "blackbook", label: "Blackbook Generator", icon: BookOpen },
    { id: "integrations", label: "Integrations", icon: Plug },
    { id: "repos", label: "Repositories Hub", icon: GitBranch },
    { id: "figma", label: "Figma Designs Hub", icon: FigmaIcon },
    { id: "miro", label: "Miro Whiteboards Hub", icon: LayoutGrid },
    { id: "sessions", label: "Login & Sessions", icon: ShieldCheck },
  ];

  const careerNavItems: NavItem[] = [
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } flex-shrink-0 hidden md:flex flex-col justify-between border-r border-slate-800 bg-slate-950 transition-all duration-200 overflow-hidden`}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        {/* College Header with Collapse Toggle */}
        <div className={`flex items-center justify-between px-4 py-3 border-b border-slate-800 ${collapsed ? "px-2" : ""}`}>
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <GraduationCap className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-white truncate">MES IMCC College</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="h-6 w-6 flex items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={`h-3.5 w-3.5 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-2 py-2 space-y-0.5">
          {studentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === "tasks" && activeTab === "kanban") ||
              (item.id === "documents" && activeTab === "docs");
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                } ${collapsed ? "justify-center px-0" : ""}`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}

          {/* CAREER Section Separator */}
          {!collapsed && (
            <div className="pt-4 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                Career
              </span>
            </div>
          )}
          {collapsed && <div className="h-px bg-slate-800 my-2 mx-1" />}

          {careerNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                } ${collapsed ? "justify-center px-0" : ""}`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer - Skilli Student Portal Link */}
      {!collapsed && (
        <div className="border-t border-slate-800 px-3 py-3">
          <a
            href="/dashboard.html"
            className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-slate-800/60 transition-colors group"
          >
            <div className="h-7 w-7 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
              <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">PlaceAI Student Portal</div>
              <div className="text-[10px] text-slate-500 truncate">firstplacewise.tech</div>
            </div>
            <ExternalLink className="h-3 w-3 text-slate-600 group-hover:text-slate-400 ml-auto shrink-0" />
          </a>
        </div>
      )}
    </aside>
  );
}
