"use client";

import React, { useState } from "react";
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
} from "lucide-react";

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
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        icon={ShieldCheck}
        title="Session & Login Management"
        description="Monitor all devices logged into your PlaceAI PMS account, inspect IP geolocations, and revoke unauthorized sessions in real-time."
        action={
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-700 bg-slate-800 text-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Refresh</button>
            <button className="rounded-lg border border-slate-700 bg-slate-800 text-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer">✏️ Change Password</button>
            <button className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 px-3 py-2 text-xs font-bold hover:bg-red-500/20 transition-colors cursor-pointer">➡️ Terminate Other Sessions</button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active Devices" value={1} sublabel="Single Login" icon={Monitor} color="text-emerald-400" />
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Security Status</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">Protected</div>
          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">2FA Ready</span>
          <div className="text-[10px] text-slate-500">Email alerts active for new sign-ins from unrecognized IPs.</div>
        </div>
        <StatCard label="Primary Location" value="Maharashtra, India" sublabel="Detected from your active network connection." icon={Globe} />
      </div>

      {/* Current Session */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monitor className="h-5 w-5 text-emerald-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Google Chrome on Windows 10/11</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">📡 This Device (Current Session)</span>
              </div>
              <span className="text-xs text-slate-400">Device Type: Desktop</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="font-mono">IP Address</span>
            <Copy className="h-3 w-3 cursor-pointer hover:text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-800">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> Approximate Location</span>
            <span className="text-xs font-bold text-white">Maharashtra, India</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Current Status</span>
            <span className="text-xs font-bold text-emerald-400">✅ Active Right Now</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Session Type</span>
            <span className="text-xs font-bold text-white">Primary Authorized Session</span>
          </div>
        </div>
      </div>

      {/* Other Sessions */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          Other Logged-in Devices & History
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">0</span>
        </h3>
        <p className="text-xs text-slate-500 italic">No other active sessions detected.</p>
      </div>
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
