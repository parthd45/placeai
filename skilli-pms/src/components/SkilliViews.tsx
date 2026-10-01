"use client";

import React, { useState, useEffect } from "react";
import { ProjectData, StudentUser } from "@/lib/types";
import {
  FolderGit2,
  Plus,
  Search,
  LayoutGrid,
  List,
  CheckSquare,
  RefreshCw,
  Users2,
  CalendarDays,
  FileText,
  UploadCloud,
  BarChart3,
  BookOpen,
  Plug,
  GitBranch,
  LayoutDashboard,
  ShieldCheck,
  Briefcase,
  ExternalLink,
  Play,
  Copy,
  Monitor,
  MapPin,
  Clock,
  Globe,
  Lock,
  Sparkles,
  ArrowRight,
  Link as LinkIcon,
  Eye,
  Save,
  Printer,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Smartphone,
  Laptop,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Check,
  LogOut,
} from "lucide-react";
import {
  UserSession,
  fetchAllSessions,
  revokeSession,
  revokeAllOtherSessions,
  getCurrentSessionId,
  isCurrentSessionRevoked,
  syncSessionsToCloudAndLocal,
} from "@/lib/sessionManager";

function FigmaIcon({ className = "h-4 w-4" }: { className?: string }) {
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

/* ============================================================================
   SHARED: Stat Card Component (used across all Skilli views)
   ============================================================================ */
function StatCard({ label, value, sublabel, icon: Icon, color }: {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: any;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
        {Icon && <Icon className={`h-4 w-4 ${color || "text-slate-600"}`} />}
      </div>
      <div className={`text-2xl font-extrabold ${color || "text-white"}`}>{value}</div>
      {sublabel && <div className="text-[10px] text-slate-500 font-medium">{sublabel}</div>}
    </div>
  );
}

/* ============================================================================
   SHARED: Empty State Component
   ============================================================================ */
function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: {
  icon: any;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
      <div className="h-14 w-14 rounded-2xl bg-slate-800/80 flex items-center justify-center">
        <Icon className="h-7 w-7 text-slate-500" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-400 max-w-sm leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1b7056] hover:bg-[#155a45] text-white px-4 py-2 text-xs font-bold transition-all cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/* ============================================================================
   SHARED: Page Header
   ============================================================================ */
function PageHeader({ icon: Icon, title, description, action }: {
  icon: any;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-3 tracking-tight">
          <Icon className="h-6 w-6 text-emerald-400" />
          <span>{title}</span>
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ============================================================================
   VIEW: Projects Page
   ============================================================================ */
export function ProjectsView({ project, user }: { project: ProjectData; user?: StudentUser | null }) {
  const [batchFilter, setBatchFilter] = useState("FY MCA (2026-27)");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        icon={FolderGit2}
        title="Active Academic Projects"
        description={`${project ? "1" : "0"} active projects in institutional directory`}
        action={
          <button className="inline-flex items-center gap-2 rounded-lg bg-[#1b7056] hover:bg-[#155a45] text-white px-4 py-2.5 text-xs font-bold transition-all cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>New Project Proposal</span>
          </button>
        }
      />

      {/* Batch & Division Filters */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-300">Academic Class:</span>
          {["Entire Batch (26-28)", "FY MCA (2026-27)", "SY MCA (2027-28)"].map((label) => (
            <button
              key={label}
              onClick={() => setBatchFilter(label)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                batchFilter === label
                  ? "bg-[#1b7056] text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Division:</span>
          <span className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">Division A</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center gap-3">
        <Search className="h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search by project title, domain, student name, or roll no..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
        />
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-white"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-white"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="All Projects" value={project ? 1 : 0} />
        <StatCard label="Capstones" value={project ? 1 : 0} sublabel="🎓" color="text-emerald-400" />
        <StatCard label="Independent (Private)" value={0} sublabel="🚀" color="text-rose-400" />
        <StatCard label="Completed" value={0} />
      </div>

      {/* Project Card or Empty State */}
      {project ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 hover:border-emerald-500/30 transition-colors cursor-pointer">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Capstone</span>
                <span className="text-[10px] font-bold text-slate-500">{project.academicYear}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{project.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{project.description}</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 shrink-0">{project.progressPercentage}%</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {project.technologies.slice(0, 5).map((t) => (
              <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">{t}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-2 border-t border-slate-800">
            <span>{project.teamMembers.length} Members</span>
            <span>•</span>
            <span>{project.tasks.length} Tasks</span>
            <span>•</span>
            <span>{project.milestones.filter((m) => m.status === "COMPLETED").length}/{project.milestones.length} Milestones</span>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={FolderGit2}
          title="No Capstone Projects Found"
          description="You are not assigned to any project matching these filters."
          actionLabel="Show All Projects"
          onAction={() => {}}
        />
      )}
    </div>
  );
}

/* ============================================================================
   VIEW: My Tasks & Deliverables
   ============================================================================ */
export function TasksView({ project }: { project: ProjectData }) {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const statusFilters = ["ALL", "TO DO", "IN PROGRESS", "IN REVIEW", "COMPLETED"];
  const filteredTasks = project.tasks.filter((t) => {
    if (statusFilter !== "ALL") {
      const mapped = statusFilter.replace(" ", "_");
      if (t.status !== mapped && t.status !== statusFilter) return false;
    }
    if (searchQuery.trim()) {
      return t.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        icon={CheckSquare}
        title="My Tasks & Deliverables"
        description="Track, prioritize, and manage project tasks across active capstone sprints."
        action={
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
            <RefreshCw className="h-4 w-4" />
          </button>
        }
      />

      {/* Search + Status Filters */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 flex items-center gap-3 w-full">
          <Search className="h-4 w-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search tasks by title, student name, or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === s
                  ? "bg-[#1b7056] text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <div key={task.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <CheckSquare className={`h-4 w-4 shrink-0 ${task.status === "DONE" ? "text-emerald-400" : "text-slate-600"}`} />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{task.title}</div>
                  {task.description && (
                    <div className="text-xs text-slate-500 truncate">{task.description}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  task.status === "DONE" ? "bg-emerald-500/15 text-emerald-400" :
                  task.status === "IN_PROGRESS" ? "bg-blue-500/15 text-blue-400" :
                  task.status === "IN_REVIEW" ? "bg-amber-500/15 text-amber-400" :
                  "bg-slate-800 text-slate-400"
                }`}>
                  {task.status.replace("_", " ")}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  task.priority === "URGENT" ? "bg-red-500/15 text-red-400" :
                  task.priority === "HIGH" ? "bg-orange-500/15 text-orange-400" :
                  "bg-slate-800 text-slate-400"
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description="Your assigned project deliverables will appear here once assigned by your mentor."
        />
      )}
    </div>
  );
}

/* ============================================================================
   VIEW: Faculty Mentorship & Guidance Hub
   ============================================================================ */
export function MentorshipView({ project }: { project: ProjectData }) {
  const [specialFilter, setSpecialFilter] = useState("All MCA Faculty");
  const filters = ["All MCA Faculty", "AI & ML", "Cloud & Web", "Database & Analytics"];

  const facultyMentors = project.mentors.length > 0 ? project.mentors : [
    { id: "m1", name: "Faculty Guide", designation: "Professor & HOD", department: "MCA Department", email: "guide@mesimcc.edu.in", avatar: "" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        icon={Users2}
        title="Faculty Mentorship & Guidance Hub"
        description="Connect with faculty advisors, schedule project reviews, live 1-on-1 chat, and get expert guidance for capstone research."
        action={
          <button className="inline-flex items-center gap-2 rounded-lg bg-[#1b7056] hover:bg-[#155a45] text-white px-4 py-2.5 text-xs font-bold transition-all cursor-pointer">
            <CalendarDays className="h-4 w-4" />
            <span>Ask for Session</span>
          </button>
        }
      />

      {/* Assigned Mentorship Panel */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Users2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Your Capstone Mentorship & Evaluation Panel</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">Team: PlaceAI</span>
              </div>
              <p className="text-xs text-slate-400">Assigned institutional committee for project supervision, industry reviews, and final defense evaluation.</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-300 rounded-lg border border-slate-700 px-3 py-1 hidden sm:block">
            🎓 FY MCA • Division A
          </span>
        </div>

        {/* Internal Faculty Guide Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <GraduationCap className="h-4 w-4 text-emerald-400" />
              <span className="font-bold uppercase tracking-wider text-emerald-400">Internal Faculty Guide</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Assigned</span>
          </div>
          <div className="text-sm font-bold text-white">{project.mentors[0]?.name || "Prof. Faculty Guide"}</div>
          <p className="text-xs text-slate-400">College Faculty Advisor for weekly sprint check-ins & curriculum alignment</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center gap-3">
        <Search className="h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search faculty mentors by name, department, or specialization..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
        />
        <div className="flex items-center gap-1.5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setSpecialFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                specialFilter === f
                  ? "bg-[#1b7056] text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div>
        <h2 className="text-sm font-bold text-white mb-4">Assigned Faculty Supervisors & Research Mentors ({facultyMentors.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facultyMentors.map((mentor) => {
            const initials = mentor.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            return (
              <div key={mentor.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold">{initials}</div>
                  <div>
                    <div className="text-sm font-bold text-white">{mentor.name}</div>
                    <div className="text-xs text-slate-400">{mentor.designation}</div>
                  </div>
                </div>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">{mentor.department}</span>
                <div className="rounded-lg bg-slate-800/60 p-2.5 text-xs text-slate-300 font-medium">
                  Software Engineering & System Architecture
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Available for Mentorship</span>
                  <span className="text-slate-500 ml-auto">Mon & Wed 10:00 AM - 12:00 PM</span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button className="flex-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 py-2 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer">💬 Chat</button>
                  <button className="flex-1 rounded-lg bg-[#1b7056] hover:bg-[#155a45] text-white py-2 text-xs font-semibold transition-all cursor-pointer">📅 Ask for Session</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   VIEW: Academic Calendar
   ============================================================================ */
export function CalendarView() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isToday = (day: number) => day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        icon={CalendarDays}
        title="Academic Calendar & Event Schedule"
        description="Track milestones, viva dates, submission deadlines, and academic events."
      />

      {/* Event Status Legend */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>Event Time Status:</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400"><span className="h-2.5 w-2.5 rounded-full bg-slate-600" /> Passed / Gone Event</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Today (Current Date)</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" /> Upcoming Milestone</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Calendar Grid */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white">{monthNames[currentMonth]} {currentYear}</h2>
              <p className="text-xs text-slate-400">Click any day to view scheduled milestones & personal reminders</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else setCurrentMonth(currentMonth - 1); }} className="h-8 w-8 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"><ChevronLeft className="h-4 w-4" /></button>
              <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else setCurrentMonth(currentMonth + 1); }} className="h-8 w-8 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {dayNames.map((d) => (
              <div key={d} className="text-center text-[11px] font-bold text-slate-500 py-2">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {days.map((day, i) => (
              <div
                key={i}
                className={`h-16 border border-slate-800/50 p-1.5 text-xs transition-colors ${
                  day ? "hover:bg-slate-800/50 cursor-pointer" : ""
                } ${day && isToday(day) ? "bg-emerald-500/15 border-emerald-500/30" : ""}`}
              >
                {day && (
                  <span className={`font-semibold ${isToday(day) ? "text-emerald-400" : "text-slate-400"}`}>
                    {day}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Events Sidebar */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Academic Timetable & Events (0)</h3>
          </div>
          <p className="text-xs text-slate-500 italic">No academic events recorded.</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   VIEW: Documents & Research Files Repository
   ============================================================================ */
export function DocumentsView() {
  const [docTab, setDocTab] = useState("my");

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        icon={FileText}
        title="Documents & Research Files Repository"
        description="Centralized academic repository for capstone thesis proposals, research datasets, SRS specs, and official college format templates."
        action={
          <button className="inline-flex items-center gap-2 rounded-lg bg-[#1b7056] hover:bg-[#155a45] text-white px-4 py-2.5 text-xs font-bold transition-all cursor-pointer">
            <UploadCloud className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        }
      />

      {/* Tab switcher */}
      <div className="flex items-center gap-4 border-b border-slate-800 pb-0">
        <button onClick={() => setDocTab("my")} className={`pb-3 border-b-2 text-xs font-bold transition-colors ${docTab === "my" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"}`}>
          My Team Documents <span className="ml-1 px-1.5 py-0.5 rounded bg-slate-800 text-[10px]">0</span>
        </button>
        <button onClick={() => setDocTab("templates")} className={`pb-3 border-b-2 text-xs font-bold transition-colors ${docTab === "templates" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"}`}>
          Official Format Templates <span className="ml-1 px-1.5 py-0.5 rounded bg-slate-800 text-[10px]">2</span>
        </button>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center gap-3">
        <Search className="h-4 w-4 text-slate-500" />
        <input type="text" placeholder="Search documents by title, project, or student name..." className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none" />
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none">
          <option>All Categories</option>
        </select>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-7 gap-2 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <span className="col-span-2">Document Title</span>
        <span>Project / Scope</span>
        <span>Uploaded By</span>
        <span>Size</span>
        <span>Last Updated</span>
        <span>Status</span>
      </div>

      <EmptyState
        icon={FileText}
        title="No documents found"
        description="Upload research files, SRS specs, or capstone proposals to get started."
        actionLabel="Upload Document"
        onAction={() => {}}
      />
    </div>
  );
}

/* ============================================================================
   VIEW: Research Library
   ============================================================================ */
export function ResearchView() {
  const [researchTab, setResearchTab] = useState("search");
  const suggestedTopics = [
    "deep learning autonomous vehicles",
    "large language models multi agent systems",
    "blockchain credential verification smart contracts",
    "edge computing iot low latency",
    "quantum computing algorithms cryptography",
    "graph neural networks drug discovery",
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        icon={BookOpen}
        title="Research Library"
        description="Search 400M+ research papers, capstone studies, and peer-reviewed scientific publications."
      />

      <div className="flex items-center gap-4 border-b border-slate-800 pb-0">
        <button onClick={() => setResearchTab("search")} className={`pb-3 border-b-2 text-xs font-bold flex items-center gap-2 transition-colors ${researchTab === "search" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"}`}>
          <Search className="h-3.5 w-3.5" /> Search Papers
        </button>
        <button onClick={() => setResearchTab("saved")} className={`pb-3 border-b-2 text-xs font-bold flex items-center gap-2 transition-colors ${researchTab === "saved" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"}`}>
          📑 Saved (0)
        </button>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-slate-500" />
          <input type="text" placeholder="Search papers — e.g. 'deep learning autonomous vehicles', 'quantum computing'..." className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none" />
        </div>
      </div>

      {/* Suggested Topics */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>Suggested Research Topics</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedTopics.map((topic) => (
            <button key={topic} className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors cursor-pointer">
              {topic}
            </button>
          ))}
        </div>
      </div>

      <EmptyState
        icon={Search}
        title="Explore Academic Research & Publications"
        description="Type any topic, technology, or title above to instantly explore millions of research studies and download PDFs."
      />
    </div>
  );
}

/* ============================================================================
   VIEW: Academic Resources Hub
   ============================================================================ */
export function ResourcesView() {
  const [activeFilter, setActiveFilter] = useState("All Resources");
  const resourceFilters = ["All Resources", "Pinned Material", "Playlists", "YouTube Videos", "Google Drive", "Notes & Docs", "Code & Repos", "Links & URLs"];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        icon={BarChart3}
        title="Academic Resources Hub"
        description="Curated lecture videos, YouTube playlists, Google Drive repositories, project references, and notes shared by faculty and administrators for all subjects."
        action={
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 px-4 py-2 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total Vault" value={0} icon={BarChart3} />
        <StatCard label="Playlists" value={0} color="text-yellow-400" />
        <StatCard label="Videos" value={0} color="text-red-400" />
        <StatCard label="Google Drive" value={0} color="text-green-400" />
        <StatCard label="Docs & Notes" value={0} color="text-blue-400" />
        <StatCard label="Pinned Items" value={0} color="text-pink-400" />
      </div>

      {/* Search & Filter */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center gap-3">
        <Search className="h-4 w-4 text-slate-500" />
        <input type="text" placeholder="Search by title, subject (e.g. DevOps, AI, DSA), tags, or faculty name..." className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none" />
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none">
          <option>All Academic Subjects</option>
        </select>
      </div>

      {/* Resource Type Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {resourceFilters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === f ? "bg-[#1b7056] text-white" : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {f} <span className="ml-1 text-[10px] opacity-60">0</span>
          </button>
        ))}
      </div>

      <EmptyState
        icon={BarChart3}
        title="No Resources Found"
        description="Academic resources shared by faculty will appear here. Check back later or try different filters."
      />
    </div>
  );
}

/* ============================================================================
   VIEW: Blackbook Generator
   ============================================================================ */
export function BlackbookView({ project }: { project: ProjectData }) {
  const [bbTab, setBbTab] = useState("fill");

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        icon={BookOpen}
        title="1-Click University Blackbook Generator"
        description="Auto-generate print-ready official project reports with dynamic chapters tailored for Software Dev, AI/ML, Software Testing, and IoT."
        action={
          <div className="flex items-center gap-2">
            <button onClick={() => setBbTab("fill")} className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${bbTab === "fill" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-slate-800 text-slate-400"}`}>🖋️ Fill Chapters</button>
            <button onClick={() => setBbTab("preview")} className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${bbTab === "preview" ? "bg-slate-700 text-white" : "bg-slate-800 text-slate-400"}`}>◼ Blackbook Preview</button>
            <button className="rounded-lg bg-slate-800 text-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer">💾 Save Draft</button>
            <button className="rounded-lg bg-[#1b7056] hover:bg-[#155a45] text-white px-4 py-2 text-xs font-bold transition-all cursor-pointer">🖨️ Print / Export PDF</button>
          </div>
        }
      />

      {/* Project & Template Selector */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <GraduationCap className="h-4 w-4 text-emerald-400" /> Select Project
          </label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-300 focus:outline-none">
            <option>{project.name}</option>
          </select>
        </div>
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Sparkles className="h-4 w-4 text-emerald-400" /> Project Type / Template Architecture
            </label>
            <span className="text-xs text-emerald-400 font-semibold cursor-pointer hover:underline">Dynamic Chapters</span>
          </div>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-300 focus:outline-none">
            <option>Software Engineering & Full Stack Project Report (SOFTWARE DEV)</option>
            <option>AI/ML Research & Neural Network Report</option>
            <option>Software Testing & QA Report</option>
            <option>IoT & Embedded Systems Report</option>
          </select>
        </div>
      </div>

      {/* Section 1: University Credentials */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-400" />
          1. Official University Title & Certificate Credentials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400">Project Title</label>
            <input type="text" defaultValue={project.name} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400">Academic Year</label>
            <input type="text" defaultValue="2025-2026" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400">College Name</label>
            <input type="text" defaultValue="MES Institute of Management & Career Courses (IMCC)" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400">Affiliated University</label>
            <input type="text" defaultValue="Savitribai Phule Pune University" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400">Degree Program</label>
            <input type="text" defaultValue="Master of Computer Applications (MCA)" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400">Internal Faculty Guide</label>
            <input type="text" defaultValue={project.mentors[0]?.name || "Prof. Internal Guide"} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400">HOD Name</label>
            <input type="text" defaultValue="Dr. Minakshi More" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400">Principal Name</label>
            <input type="text" defaultValue="Dr. Santosh Deshpande" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   VIEW: Integrations & Ecosystem Marketplace
   ============================================================================ */
export function IntegrationsView() {
  const integrations = [
    { name: "GitHub Repository Sync", category: "Developer Tools", icon: GitBranch, connected: false, description: "Authorize GitHub OAuth to sync commits, pull requests, issues, and branch CI/CD build status to your project." },
    { name: "Google Calendar & Meet", category: "Productivity & Video", icon: CalendarDays, connected: false, description: "Authorize Google OAuth to sync mentor review schedules and auto-generate Google Meet conference links." },
    { name: "Figma Design System", category: "Design & Prototyping", icon: FigmaIcon, connected: false, description: "Attach mobile app prototypes, dark mode UI design systems, and track last modified design changes." },
    { name: "Miro Architecture Whiteboard", category: "Whiteboard & Architecture", icon: LayoutGrid, connected: false, description: "Embed live view-only sprint architecture canvas and BLE beacon placement maps." },
    { name: "Semantic Scholar Academic API", category: "Academic Research", icon: BookOpen, connected: true, description: "Search 200M+ research papers, citation metrics, and save paper citations directly to capstone research collection." },
    { name: "LinkedIn Career Portfolio", category: "Career & Identity", icon: Briefcase, connected: false, description: "Verify student academic achievements and link official LinkedIn student career profile to portfolio." },
  ];

  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        icon={Plug}
        title="Integrations & Ecosystem Marketplace"
        description="Connect external tools via OAuth to your account. Continuously sync repositories, designs, meetings, and research papers."
        action={
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {connectedCount} OF {integrations.length} TOOLS CONNECTED IN DATABASE
          </span>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((tool) => {
          const Icon = tool.icon;
          return (
            <div key={tool.name} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-emerald-400" />
                </div>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded ${
                  tool.connected
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "bg-slate-800 text-slate-500"
                }`}>
                  {tool.connected ? "● Connected" : "Not Connected"}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{tool.name}</h3>
                <p className="text-[11px] text-emerald-400 font-semibold">{tool.category}</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{tool.description}</p>
              <div className="rounded-lg bg-slate-800/60 p-2.5 text-[11px] text-slate-500">
                {tool.connected ? `Account: Public Academic API` : "Tool is disconnected. Click Connect Tool to launch OAuth authorization dialog."}
              </div>
              <button className={`w-full rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer ${
                tool.connected
                  ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15"
                  : "bg-[#1b7056] hover:bg-[#155a45] text-white"
              }`}>
                {tool.connected ? "✓ Connected" : "⚡ Connect Tool"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
   VIEW: GitHub Repository Hub
   ============================================================================ */
export function ReposView({ project }: { project: ProjectData }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center">
            <GitBranch className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">GitHub Repository Management & Analytics Center</h1>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">Not Connected</span>
            <p className="text-xs text-slate-400 mt-1">Centralized workspace for your connected GitHub repositories. Filter Public & Private repos, monitor commit velocity, and manage codebases.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="rounded-lg border border-slate-700 bg-slate-800 text-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Refresh</button>
          <button className="rounded-lg border border-slate-700 bg-slate-800 text-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"><GitBranch className="h-3.5 w-3.5" /> Connect GitHub (OAuth)</button>
          <button className="rounded-lg border border-slate-700 bg-slate-800 text-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Unlock Private Repos (PAT)</button>
          <button className="rounded-lg bg-[#1b7056] hover:bg-[#155a45] text-white px-4 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" /> Create New Repo</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Repositories" value={0} sublabel="Not Connected" icon={GitBranch} color="text-emerald-400" />
        <StatCard label="Public Repositories" value={0} sublabel="Open Source" icon={Globe} color="text-emerald-400" />
        <StatCard label="Private Repositories" value={0} sublabel="Encrypted" icon={Lock} />
        <StatCard label="Total Commit Stream" value={0} sublabel="Commits logged" color="text-emerald-400" />
      </div>

      <EmptyState
        icon={GitBranch}
        title="GitHub Account Not Connected"
        description="Connect your official GitHub account to automatically display all public and private repositories, branches, and commit velocity."
        actionLabel="Connect GitHub via OAuth"
        onAction={() => {}}
      />
    </div>
  );
}

/* ============================================================================
   VIEW: Figma Designs Hub
   ============================================================================ */
export function FigmaView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        icon={FigmaIcon}
        title="Figma Design Systems & Prototypes Hub"
        description="Centralized workspace for capstone UI prototypes, wireframe systems, dark mode design tokens, and live Figma canvases."
        action={
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"><RefreshCw className="h-4 w-4" /></button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#1b7056] hover:bg-[#155a45] text-white px-4 py-2.5 text-xs font-bold transition-all cursor-pointer">
              <Plus className="h-4 w-4" /> Attach Figma Prototype URL
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Design Systems" value={0} sublabel="100% Synced" color="text-emerald-400" />
        <StatCard label="UI Component Nodes" value={0} sublabel="Design tokens" />
        <StatCard label="Connected Workspace" value="Disconnected" sublabel="AES-256" color="text-red-400" />
        <StatCard label="Design Sync Health" value="Healthy" sublabel="REST API v1" color="text-emerald-400" />
      </div>

      <EmptyState
        icon={FigmaIcon}
        title="No Figma Design Files Attached"
        description='Click "Attach Figma Prototype URL" above to enter your personal Figma file URL and Personal Access Token.'
        actionLabel="Attach Figma Design Prototype"
        onAction={() => {}}
      />
    </div>
  );
}

/* ============================================================================
   VIEW: Miro Whiteboards Hub
   ============================================================================ */
export function MiroView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        icon={LayoutGrid}
        title="Miro Architecture Whiteboards Hub"
        description="Centralized interactive whiteboards for sprint planning, architecture diagrams, BLE beacon maps, and mentor review."
        action={
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"><RefreshCw className="h-4 w-4" /></button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#1b7056] hover:bg-[#155a45] text-white px-4 py-2.5 text-xs font-bold transition-all cursor-pointer">
              <Plus className="h-4 w-4" /> Attach Miro Board Link
            </button>
          </div>
        }
      />

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-emerald-400 shrink-0" />
        <div>
          <div className="text-xs font-bold text-white">Mentor & Project Manager Shared Visibility</div>
          <p className="text-xs text-slate-400">Attached Miro boards are automatically shared with assigned mentors and faculty members for real-time architecture feedback.</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center gap-3">
        <Search className="h-4 w-4 text-slate-500" />
        <input type="text" placeholder="Search Miro architecture boards by title or description..." className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none" />
      </div>

      <EmptyState
        icon={LayoutGrid}
        title="No Miro Whiteboards Attached"
        description='Click "Attach Miro Board Link" above to enter your Miro board URL and share architecture canvases with mentors.'
        actionLabel="Attach Miro Whiteboard Link"
        onAction={() => {}}
      />
    </div>
  );
}

/* ============================================================================
   VIEW: Session & Login Management
   ============================================================================ */
export function SessionsView({ user }: { user?: StudentUser | null }) {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [removingIds, setRemovingIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSelfRevoked, setIsSelfRevoked] = useState(false);

  const userEmail = user?.email || "parth.deshmukh@mesimcc.edu.in";
  const currentSessionId = typeof window !== "undefined" ? getCurrentSessionId() : "";

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`📋 Copied IP address (${text}) to clipboard!`);
    }
  };

  const loadSessions = async (showIndicator = false) => {
    if (showIndicator) setIsRefreshing(true);
    try {
      const data = await fetchAllSessions(userEmail);
      // Only keep active, non-revoked sessions so revoked slides are permanently removed
      setSessions(data.filter((s) => s.status !== "revoked"));
    } catch (e) {
      console.warn("Could not load sessions:", e);
    } finally {
      setIsLoading(false);
      if (showIndicator) {
        setTimeout(() => setIsRefreshing(false), 300);
      }
    }
  };

  useEffect(() => {
    loadSessions();

    // Auto-sync polling every 5 seconds to detect sessions from other browsers and remote revocations
    const interval = setInterval(async () => {
      // Check if current browser session was revoked remotely
      const revoked = await isCurrentSessionRevoked(userEmail);
      if (revoked) {
        setIsSelfRevoked(true);
        return;
      }
      loadSessions();
    }, 5000);

    // Listen to inter-tab broadcast channels (general & user-scoped)
    let bc: BroadcastChannel | null = null;
    let bcUser: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        const normalizedEmail = userEmail.toLowerCase().trim();
        bc = new BroadcastChannel("placeai_session_sync_bus");
        bcUser = new BroadcastChannel(`placeai_session_sync_bus_${normalizedEmail}`);

        const handleMsg = (event: MessageEvent) => {
          if (event.data?.type === "SESSIONS_UPDATED") {
            setSessions(event.data.sessions.filter((s: UserSession) => s.status !== "revoked"));
          } else if (event.data?.type === "SESSION_REVOKED") {
            if (event.data.revokedSessionId === currentSessionId) {
              setIsSelfRevoked(true);
            } else {
              setSessions((prev) => prev.filter((s) => s.id !== event.data.revokedSessionId && s.status !== "revoked"));
            }
          } else if (event.data?.type === "ALL_OTHER_SESSIONS_REVOKED") {
            if (event.data.currentSessionId !== currentSessionId) {
              setIsSelfRevoked(true);
            } else {
              setSessions((prev) => prev.filter((s) => s.id === currentSessionId && s.status !== "revoked"));
            }
          }
        };

        bc.onmessage = handleMsg;
        bcUser.onmessage = handleMsg;
      }
    } catch (e) {}

    return () => {
      clearInterval(interval);
      if (bc) bc.close();
      if (bcUser) bcUser.close();
    };
  }, [userEmail, currentSessionId]);

  const handleRevokeSingle = async (sessId: string, deviceName: string) => {
    setRevokingId(sessId);
    // Mark for slide-out animation
    setRemovingIds((prev) => [...prev, sessId]);

    // Animate removal after brief slide-out transition so slide removes cleanly
    setTimeout(() => {
      setSessions((prev) => prev.filter((s) => s.id !== sessId));
      setRemovingIds((prev) => prev.filter((id) => id !== sessId));
    }, 280);

    try {
      const res = await revokeSession(sessId, userEmail);
      setSessions(res.updatedSessions.filter((s) => s.status !== "revoked" && s.id !== sessId));
      showToast(`🔒 Session for "${deviceName}" has been revoked and removed!`);
    } catch (e) {
      showToast("❌ Could not revoke session. Please try again.");
      loadSessions();
    } finally {
      setRevokingId(null);
    }
  };

  const handleTerminateAllOthers = async () => {
    setRevokingId("ALL_OTHERS");
    const otherIds = otherSessions.map((s) => s.id);
    setRemovingIds((prev) => [...prev, ...otherIds]);

    setTimeout(() => {
      setSessions((prev) => prev.filter((s) => s.id === currentSessionId));
      setRemovingIds([]);
    }, 280);

    try {
      const res = await revokeAllOtherSessions(userEmail);
      setSessions(res.updatedSessions.filter((s) => s.status !== "revoked"));
      showToast(`🛡️ All other active device sessions have been terminated and removed!`);
    } catch (e) {
      showToast("❌ Could not terminate sessions. Please try again.");
      loadSessions();
    } finally {
      setRevokingId(null);
    }
  };

  const handleAddSecondarySource = async () => {
    const simId = "sess_src_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6);
    const newSession: UserSession = {
      id: simId,
      userEmail,
      deviceName: "Mozilla Firefox on Ubuntu Linux (Secondary Workstation)",
      deviceType: "desktop",
      browser: "Mozilla Firefox 125",
      os: "Ubuntu 24.04 LTS",
      ipAddress: "49.36.128.45",
      location: "Mumbai, Maharashtra, India",
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      status: "active",
      isCurrent: false,
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    await syncSessionsToCloudAndLocal(updated);
    showToast(`✅ Secondary login source registered! You can now test revoking it below.`);
  };

  const currentSession = sessions.find((s) => s.isCurrent) || sessions[0];
  const otherSessions = sessions.filter((s) => s.id !== currentSession?.id && s.status !== "revoked");
  const activeCount = sessions.filter((s) => s.status === "active").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 shadow-2xl border border-slate-700 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Self-Revoked Security Overlay (if another device revoked this browser) */}
      {isSelfRevoked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="max-w-md w-full rounded-2xl border border-red-500/40 bg-slate-950 p-6 text-center space-y-4 shadow-2xl">
            <div className="h-14 w-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Your Login Session Was Revoked</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              This device session was terminated from another logged-in browser or administrative security panel. For your protection, this session has been locked.
            </p>
            <div className="pt-2">
              <a
                href="/pms/auth/login"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign In Again</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <PageHeader
        icon={ShieldCheck}
        title="Session & Login Management"
        description="Monitor all devices logged into your PlaceAI PMS account, inspect IP geolocations, and revoke unauthorized sessions in real-time."
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => loadSessions(true)}
              disabled={isRefreshing}
              className="rounded-lg border border-slate-700 bg-slate-800 text-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Syncing..." : "Refresh"}</span>
            </button>

            <button
              onClick={handleAddSecondarySource}
              className="rounded-lg border border-slate-700 bg-slate-800 text-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Register a simulated secondary device to test cross-device revocation"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-400" />
              <span>+ Add Secondary Source</span>
            </button>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="rounded-lg border border-slate-700 bg-slate-800 text-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
            >
              ✏️ Change Password
            </button>

            <button
              onClick={handleTerminateAllOthers}
              disabled={revokingId === "ALL_OTHERS"}
              className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 px-3 py-2 text-xs font-bold hover:bg-red-500/20 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{revokingId === "ALL_OTHERS" ? "Terminating..." : "Terminate Other Sessions"}</span>
            </button>
          </div>
        }
      />

      {/* Security Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Active Devices"
          value={isLoading ? "..." : `${activeCount} Active`}
          sublabel="Multi-Device Cross-Sync Enabled"
          icon={Monitor}
          color="text-emerald-400"
        />
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Security Status</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">Protected</div>
          <div className="flex items-center gap-2">
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
              Cloud Synced
            </span>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400">
              Revocation Guard
            </span>
          </div>
          <div className="text-[10px] text-slate-500">
            Real-time multi-browser session enforcement active for {userEmail}.
          </div>
        </div>
        <StatCard
          label="Primary Location"
          value={currentSession?.location || "Maharashtra, India"}
          sublabel="Detected from active network telemetry"
          icon={Globe}
        />
      </div>

      {/* Section 1: This Device (Current Session) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Active Device (Current Browser)</span>
        </h3>

        {currentSession ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-4 shadow-sm">
            <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  {currentSession.deviceType === "mobile" ? (
                    <Smartphone className="h-5 w-5" />
                  ) : (
                    <Monitor className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">{currentSession.deviceName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      This Device (Current Session)
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Device Type: <span className="capitalize text-slate-200">{currentSession.deviceType}</span> • Browser: <span className="text-slate-200">{currentSession.browser}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="font-mono text-emerald-400 font-bold">{currentSession.ipAddress}</span>
                <button
                  onClick={() => copyToClipboard(currentSession.ipAddress)}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                  title="Copy IP"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800/80">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Approximate Location
                </span>
                <span className="text-xs font-bold text-white">{currentSession.location}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Current Status
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Active Right Now
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Session Token
                </span>
                <span className="text-xs font-mono text-slate-300 truncate block">
                  {currentSession.id}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 text-xs text-slate-400">Detecting session...</div>
        )}
      </div>

      {/* Section 2: Other Logged-in Devices & Multi-Source History */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Other Logged-in Devices & Multi-Source History</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {otherSessions.length} Devices
            </span>
          </h3>

          <span className="text-[11px] text-slate-500">
            Sessions can be revoked from any device in real-time
          </span>
        </div>

        {otherSessions.length > 0 ? (
          <div className="space-y-3 transition-all duration-300">
            {otherSessions.map((s) => {
              const isRemoving = removingIds.includes(s.id);
              const isBeingRevoked = revokingId === s.id;

              return (
                <div
                  key={s.id}
                  className={`rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all duration-300 ease-out hover:border-slate-700 ${
                    isRemoving
                      ? "opacity-0 -translate-x-8 scale-95 pointer-events-none max-h-0 py-0 overflow-hidden my-0 border-transparent"
                      : "opacity-100 translate-x-0 scale-100"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-500/10 text-blue-400">
                        {s.deviceType === "mobile" ? (
                          <Smartphone className="h-5 w-5" />
                        ) : s.deviceType === "tablet" ? (
                          <Smartphone className="h-5 w-5" />
                        ) : (
                          <Laptop className="h-5 w-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white truncate">
                            {s.deviceName}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                            Active Session
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-500" />
                            {s.location}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-slate-300">{s.ipAddress}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-500" />
                            Active {new Date(s.lastActiveAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => copyToClipboard(s.ipAddress)}
                        className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy IP Address"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => handleRevokeSingle(s.id, s.deviceName)}
                        disabled={isBeingRevoked || isRemoving}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                        title="Immediately revoke and remove this session"
                      >
                        <Trash2 className={`h-3.5 w-3.5 ${isBeingRevoked ? "animate-spin" : ""}`} />
                        <span>{isBeingRevoked ? "Revoking..." : "Revoke Session"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center space-y-2 animate-in fade-in duration-200">
            <Monitor className="h-6 w-6 text-slate-600 mx-auto" />
            <h4 className="text-xs font-bold text-slate-400">No other active sessions detected</h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              If you log in from another browser, laptop, or mobile phone, that login session will appear here in real-time. You can revoke any device session at any time.
            </p>
          </div>
        )}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-400" />
                <span>Update Account Password</span>
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Updating your institutional PlaceAI password will immediately terminate all active sessions across all devices for security.
            </p>
            <div className="space-y-3 pt-2">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="password"
                placeholder="New Password (min 8 characters)"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  showToast("🔒 Password successfully updated! Other sessions terminated.");
                  handleTerminateAllOthers();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1b7056] hover:bg-[#155a45] text-white"
              >
                Save & Terminate Other Sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   VIEW: Portfolio
   ============================================================================ */
export function PortfolioView({ user }: { user?: StudentUser | null }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        icon={Briefcase}
        title="Career Portfolio"
        description="Build and showcase your professional academic portfolio with projects, skills, certifications, and achievements."
      />

      <EmptyState
        icon={Briefcase}
        title="Portfolio Coming Soon"
        description="Your career portfolio will be auto-generated from your capstone projects, skills, certifications, and academic achievements. Stay tuned!"
      />
    </div>
  );
}
