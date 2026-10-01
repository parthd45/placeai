"use client";

import React, { useState } from "react";
import {
  ProjectData,
  Milestone,
  Task,
  TaskStatus,
  TaskPriority,
  TeamMember,
  StudentUser,
} from "@/lib/types";
import {
  GitBranch,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  UploadCloud,
  FileCheck,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  User,
  Calendar,
  X,
  Check,
  Users,
  UserPlus,
  Crown,
  Trash2,
  Edit3,
  Copy,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileText,
  Send,
  SlidersHorizontal,
  LayoutDashboard,
  KanbanSquare,
  BookOpen,
  Download,
  GraduationCap,
  Code2,
  FileCode2,
  Database,
  Terminal,
} from "lucide-react";

interface StudentDashboardProps {
  project: ProjectData;
  onUpdateProject: (updated: ProjectData) => void;
  user?: StudentUser | null;
  onLeaveSquad?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function StudentDashboard({
  project,
  onUpdateProject,
  user,
  onLeaveSquad,
  activeTab = "overview",
  onTabChange,
}: StudentDashboardProps) {
  const currentTab = activeTab || "overview";

  const switchTab = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Milestone submission state
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kanban task creation state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>("MEDIUM");
  const [newTaskLabel, setNewTaskLabel] = useState("Frontend");
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState(project.teamMembers[0]?.id || "mem-1");
  const [newTaskDueDate, setNewTaskDueDate] = useState("Oct 15");
  const [taskFilterLabel, setTaskFilterLabel] = useState("ALL");

  // Project Settings / Edit Modal state
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const [editDesc, setEditDesc] = useState(project.description);
  const [editRepo, setEditRepo] = useState(project.repositoryUrl);
  const [editFigma, setEditFigma] = useState(project.figmaUrl);
  const [editMiro, setEditMiro] = useState(project.miroUrl);
  const [editTechInput, setEditTechInput] = useState(project.technologies.join(", "));

  // Team Formation Modals State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showJoinSquadModal, setShowJoinSquadModal] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [addMemberTab, setAddMemberTab] = useState<"manual" | "peers">("peers");

  // Manual Member Form State
  const [memberFormName, setMemberFormName] = useState("");
  const [memberFormRoll, setMemberFormRoll] = useState("");
  const [memberFormEmail, setMemberFormEmail] = useState("");
  const [memberFormRole, setMemberFormRole] = useState("Full-Stack Dev");
  const [memberFormSkills, setMemberFormSkills] = useState("React, Node.js");

  // Real registered peers passed from PlaceAI database or cached real peers (NO fake names)
  const peerScholars = (user?.peerCandidates && user.peerCandidates.length > 0)
    ? user.peerCandidates
    : (function () {
        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem("placeai_pms_real_peers");
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
          } catch (e) {}
        }
        return [];
      })();

  // Copy Squad Invite Code to Clipboard
  const handleCopyInviteCode = () => {
    const code = project.inviteCode || "IMCC-CAP-7942";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      showToast(`📋 Squad Invite Code ${code} copied! Share with your teammates.`);
    } else {
      showToast(`Squad Code: ${code}`);
    }
  };

  // Add Member Handler
  const handleAddMember = (memberData: Omit<TeamMember, "id">) => {
    const maxCapacity = project.maxTeamSize || 4;
    if (project.teamMembers.length >= maxCapacity) {
      showToast(`⚠️ Squad is at full capacity (${maxCapacity}/${maxCapacity} scholars). IMCC Capstone policy limits teams to ${maxCapacity} members.`);
      return;
    }

    const isAlreadyMember = project.teamMembers.some(
      (m) => m.rollNumber.toLowerCase() === memberData.rollNumber.toLowerCase()
    );
    if (isAlreadyMember) {
      showToast(`⚠️ Student with Roll No ${memberData.rollNumber} is already in the project squad.`);
      return;
    }

    const newMember: TeamMember = {
      ...memberData,
      id: `mem-${Date.now()}`,
      joinedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    const updatedTeam = [...project.teamMembers, newMember];
    onUpdateProject({
      ...project,
      teamMembers: updatedTeam,
    });

    setShowAddMemberModal(false);
    setMemberFormName("");
    setMemberFormRoll("");
    setMemberFormEmail("");
    showToast(`🎉 ${newMember.name} (${newMember.rollNumber}) successfully added to Capstone Squad!`);
  };

  // Remove Member
  const handleRemoveMember = (memberId: string) => {
    const target = project.teamMembers.find((m) => m.id === memberId);
    if (!target) return;

    if (target.role === "Team Lead" && project.teamMembers.length > 1) {
      showToast("⚠️ Cannot remove Team Lead. Please transfer the Lead role first.");
      return;
    }

    if (project.teamMembers.length <= 1) {
      showToast("⚠️ Project squad must have at least 1 student scholar.");
      return;
    }

    const fallbackLead = project.teamMembers.find((m) => m.id !== memberId) || project.teamMembers[0];
    const updatedTasks = project.tasks.map((t) => {
      if (t.assignee?.id === memberId) {
        return { ...t, assignee: fallbackLead };
      }
      return t;
    });

    const updatedTeam = project.teamMembers.filter((m) => m.id !== memberId);
    onUpdateProject({
      ...project,
      teamMembers: updatedTeam,
      tasks: updatedTasks,
    });

    showToast(`Removed ${target.name} from squad.`);
  };

  // Promote Member to Team Lead
  const handlePromoteLead = (memberId: string) => {
    const updatedTeam = project.teamMembers.map((m) => {
      if (m.id === memberId) {
        return { ...m, role: "Team Lead" as const };
      }
      if (m.role === "Team Lead") {
        return { ...m, role: "Full-Stack Dev" as const };
      }
      return m;
    });

    onUpdateProject({
      ...project,
      teamMembers: updatedTeam,
    });

    const newLead = updatedTeam.find((m) => m.id === memberId);
    showToast(`👑 ${newLead?.name} is now the Team Lead!`);
  };

  // Change Member Role
  const handleChangeRole = (memberId: string, newRole: string) => {
    const updatedTeam = project.teamMembers.map((m) => {
      if (m.id === memberId) {
        return { ...m, role: newRole };
      }
      return m;
    });

    onUpdateProject({
      ...project,
      teamMembers: updatedTeam,
    });

    showToast("Teammate role updated.");
  };

  // Join Existing Squad
  const handleJoinSquadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    if (joinCodeInput.trim().toUpperCase() === (project.inviteCode || "IMCC-CAP-7942")) {
      showToast("✓ Verified! You are already connected to this Capstone Squad.");
      setShowJoinSquadModal(false);
      setJoinCodeInput("");
      return;
    }

    showToast(`✓ Squad Passcode "${joinCodeInput.toUpperCase()}" verified! Capstone workspace synchronized.`);
    setShowJoinSquadModal(false);
    setJoinCodeInput("");
  };

  // Kanban Task Movement & Creation
  const shiftTask = (taskId: string, direction: "next" | "prev") => {
    const statusFlow: TaskStatus[] = ["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
    const updatedTasks = project.tasks.map((task) => {
      if (task.id === taskId) {
        const currentIndex = statusFlow.indexOf(task.status);
        const nextIndex =
          direction === "next"
            ? Math.min(statusFlow.length - 1, currentIndex + 1)
            : Math.max(0, currentIndex - 1);
        return { ...task, status: statusFlow[nextIndex] };
      }
      return task;
    });

    onUpdateProject({
      ...project,
      tasks: updatedTasks,
    });

    const moved = updatedTasks.find((t) => t.id === taskId);
    showToast(`Task moved to ${moved?.status.replace("_", " ")}`);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const assignee =
      project.teamMembers.find((m) => m.id === newTaskAssigneeId) || project.teamMembers[0];

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      status: "TODO",
      priority: newTaskPriority,
      assignee: assignee,
      dueDate: newTaskDueDate,
      labels: [newTaskLabel],
    };

    onUpdateProject({
      ...project,
      tasks: [...project.tasks, newTask],
    });

    setShowTaskModal(false);
    setNewTaskTitle("");
    setNewTaskDesc("");
    showToast(`✓ Task "${newTask.title}" added to Sprint Board!`);
  };

  const deleteTask = (taskId: string) => {
    const updated = project.tasks.filter((t) => t.id !== taskId);
    onUpdateProject({
      ...project,
      tasks: updated,
    });
    showToast("Task deleted.");
  };

  // Milestone Deliverable Submission
  const handleMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const updatedMilestones = project.milestones.map((m) => {
        if (m.id === selectedMilestone.id) {
          const files = m.submissionFiles ? [...m.submissionFiles] : [];
          if (uploadedFile) {
            files.push({
              name: uploadedFile.name,
              size: uploadedFile.size,
              url: "#",
              uploadedAt: new Date().toISOString().split("T")[0],
            });
          }
          return {
            ...m,
            status: "IN_REVIEW" as const,
            submissionFiles: files,
            feedback: "Deliverable uploaded. Awaiting evaluation from Dr. Shrikant Joshi / Prof. Minakshi More.",
          };
        }
        return m;
      });

      onUpdateProject({
        ...project,
        milestones: updatedMilestones,
        progressPercentage: Math.min(100, project.progressPercentage + 15),
      });

      setIsSubmitting(false);
      setSelectedMilestone(null);
      setUploadedFile(null);
      setSubmissionNotes("");
      showToast(`🎉 ${selectedMilestone.name} submitted for Guide Review!`);
    }, 600);
  };

  // Save Project Settings
  const handleSaveProjectSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTech = editTechInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onUpdateProject({
      ...project,
      name: editName,
      description: editDesc,
      repositoryUrl: editRepo,
      figmaUrl: editFigma,
      miroUrl: editMiro,
      technologies: updatedTech,
    });

    setShowEditProjectModal(false);
    showToast("✓ Capstone Project details updated!");
  };

  // Kanban status columns
  const kanbanColumns: { id: TaskStatus; label: string; dotColor: string }[] = [
    { id: "BACKLOG", label: "Backlog", dotColor: "bg-slate-400" },
    { id: "TODO", label: "To Do", dotColor: "bg-blue-500" },
    { id: "IN_PROGRESS", label: "In Progress", dotColor: "bg-amber-500" },
    { id: "IN_REVIEW", label: "In Review", dotColor: "bg-purple-500" },
    { id: "DONE", label: "Completed", dotColor: "bg-emerald-500" },
  ];

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30";
      case "HIGH":
        return "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30";
      case "MEDIUM":
        return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "LOW":
        return "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30";
    }
  };

  // Real viva score calculations
  const totalAssignedScore = project.rubricCriteria.reduce((sum, c) => sum + (c.assignedScore || 0), 0);
  const totalMaxScore = project.rubricCriteria.reduce((sum, c) => sum + (c.maxScore || 0), 0) || 100;
  const vivaPct = Math.round((totalAssignedScore / totalMaxScore) * 100);
  const vivaGrade =
    totalAssignedScore === 0
      ? "Pending Faculty Evaluation"
      : vivaPct >= 90
      ? "Grade A+ (Distinction Track)"
      : vivaPct >= 75
      ? "Grade A (First Class)"
      : "Grade B+ (Higher Second Class)";

  // Filter tasks in Kanban
  const filteredTasks = project.tasks.filter((t) => {
    if (taskFilterLabel === "ALL") return true;
    return t.labels.includes(taskFilterLabel);
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 shadow-2xl border border-slate-800 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Interactive Workspace Tabs Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        {[
          { id: "overview", label: "Project Cockpit", icon: LayoutDashboard },
          {
            id: "milestones",
            label: "Milestones & Submissions",
            icon: CheckCircle2,
            badge: `${project.milestones.filter((m) => m.status === "COMPLETED").length}/5 Done`,
          },
          {
            id: "kanban",
            label: "Taskboard (Kanban)",
            icon: KanbanSquare,
            badge: `${project.tasks.length} Tasks`,
          },
          {
            id: "rubrics",
            label: "Evaluation & Rubrics",
            icon: Award,
            badge: totalAssignedScore > 0 ? `${totalAssignedScore}/100` : "Pending",
          },
          {
            id: "team",
            label: "Team & Guides",
            icon: Users,
            badge: `${project.teamMembers.length}/4 Members`,
          },
          {
            id: "docs",
            label: "IEEE / Synopsis Docs",
            icon: FileText,
            badge: "Artifacts",
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#1b7056] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: OVERVIEW (PROJECT COCKPIT) */}
      {/* ========================================================================= */}
      {currentTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Hero Project Banner */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-lg bg-[#2D7F62]/10 dark:bg-[#2D7F62]/20 text-[#1b7056] dark:text-emerald-400 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                    {project.type} PROJECT
                  </span>
                  <span className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {project.academicYear} • {project.division}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Status: {project.status}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {project.name}
                  </h1>
                  <button
                    onClick={() => {
                      setEditName(project.name);
                      setEditDesc(project.description);
                      setEditRepo(project.repositoryUrl);
                      setEditFigma(project.figmaUrl);
                      setEditMiro(project.miroUrl);
                      setEditTechInput(project.technologies.join(", "));
                      setShowEditProjectModal(true);
                    }}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                    title="Edit Project Details & Repositories"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {project.description}
                </p>

                {/* Tech Stack tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 mr-1">Stack:</span>
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick External Actions & Repo Links */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0">
                {project.repositoryUrl && (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
                  >
                    <GitBranch className="h-4 w-4" />
                    <span>GitHub Repository</span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => switchTab("team")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 px-3 py-2 text-xs font-bold hover:bg-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>View Squad</span>
                  </button>

                  <button
                    onClick={() => setShowTaskModal(true)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1b7056] hover:bg-[#155a45] text-white px-3 py-2 text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Task</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 4 Metric Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => switchTab("milestones")}
              className="metric-card space-y-2 cursor-pointer hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Milestone Progress</span>
                <CheckCircle2 className="h-4 w-4 text-[#1b7056] dark:text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {project.progressPercentage}%
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#1b7056] h-full rounded-full transition-all duration-500"
                  style={{ width: `${project.progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500">
                {project.milestones.filter((m) => m.status === "COMPLETED").length} of 5 phases completed
              </p>
            </div>

            <div
              onClick={() => switchTab("team")}
              className="metric-card space-y-2 cursor-pointer hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Squad Scholars</span>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-baseline gap-1.5">
                <span>{project.teamMembers.length}</span>
                <span className="text-xs text-slate-400 font-semibold">/ {project.maxTeamSize || 4} slots</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {project.teamMembers.length >= (project.maxTeamSize || 4)
                  ? "Squad capacity reached"
                  : `${(project.maxTeamSize || 4) - project.teamMembers.length} open slots available`}
              </p>
            </div>

            <div
              onClick={() => switchTab("kanban")}
              className="metric-card space-y-2 cursor-pointer hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Agile Tasks</span>
                <Layers className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-baseline gap-1.5">
                <span>{project.tasks.filter((t) => t.status === "DONE").length}</span>
                <span className="text-xs text-slate-400 font-semibold">/ {project.tasks.length} done</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {project.tasks.filter((t) => t.status === "IN_PROGRESS").length} tasks active in sprint
              </p>
            </div>

            <div
              onClick={() => switchTab("rubrics")}
              className="metric-card space-y-2 cursor-pointer hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Faculty Viva Score</span>
                <Award className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
                <span>{totalAssignedScore}</span>
                <span className="text-xs text-slate-400 font-semibold">/ {totalMaxScore}</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold">
                {totalAssignedScore > 0 ? `${vivaGrade} (${vivaPct}%)` : "Pending Viva Voce Defense"}
              </p>
            </div>
          </section>

          {/* Quick Dual Cards: Active Milestone & Sprint Tasks Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Milestone Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1b7056] dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Current Milestone In-Flight
                    </h3>
                  </div>
                  <button
                    onClick={() => switchTab("milestones")}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>View All 5 Phases</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                {(() => {
                  const activeM =
                    project.milestones.find((m) => m.status !== "COMPLETED") ||
                    project.milestones[0];
                  return (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {activeM.phase}
                        </span>
                        <span className="font-semibold text-slate-500">
                          Due: {activeM.dueDate}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {activeM.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {activeM.description}
                      </p>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-amber-500/10 text-amber-600 border-amber-500/20">
                          Status: {activeM.status}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedMilestone(activeM);
                            setUploadedFile(null);
                            setSubmissionNotes("");
                          }}
                          className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold shadow-xs cursor-pointer"
                        >
                          Submit Artifact
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between">
                <span>Adjudicator: Dr. Shrikant Joshi</span>
                <span>Committee: MES IMCC MCA</span>
              </div>
            </div>

            {/* Quick Sprint Tasks Preview */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-purple-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Active Sprint Tasks ({project.tasks.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => switchTab("kanban")}
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <span>Open Taskboard</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                {project.tasks.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-center space-y-2">
                    <Layers className="h-7 w-7 mx-auto text-slate-400 opacity-60" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      No sprint tasks created yet
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Break your capstone deliverables into agile sprint tasks for your teammates.
                    </p>
                    <button
                      onClick={() => setShowTaskModal(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#1b7056] text-white px-3 py-1.5 text-xs font-bold shadow-xs cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Create First Task</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {project.tasks.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span
                            className={`h-2 w-2 rounded-full shrink-0 ${
                              t.status === "DONE"
                                ? "bg-emerald-500"
                                : t.status === "IN_PROGRESS"
                                ? "bg-amber-500"
                                : "bg-blue-500"
                            }`}
                          />
                          <span className="font-semibold text-slate-900 dark:text-white truncate">
                            {t.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Sprint Cycle: Sprint 3 (Oct 2026)</span>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  + Add Sprint Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: MILESTONES & FORMAL DELIVERABLES */}
      {/* ========================================================================= */}
      {currentTab === "milestones" && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#1b7056] dark:text-emerald-400" />
                <span>IMCC University Capstone Milestones & Deliverables</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official 5-Phase Master of Computer Applications Syllabus Schedule (MES IMCC Autonomous).
              </p>
            </div>

            <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {project.milestones.filter((m) => m.status === "COMPLETED").length} of 5 Phases Completed
            </div>
          </div>

          <div className="space-y-4">
            {project.milestones.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-5 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {m.phase}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {m.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded border ${
                        m.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : m.status === "IN_REVIEW"
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {m.status}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedMilestone(m);
                        setUploadedFile(null);
                        setSubmissionNotes("");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-2xs cursor-pointer transition-colors"
                    >
                      <UploadCloud className="h-3.5 w-3.5" />
                      <span>Upload Artifact</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {m.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                  <div>
                    <span>Start: {m.startDate}</span>
                    <span className="mx-2">•</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Target Due Date: {m.dueDate}
                    </span>
                  </div>
                  {m.score && (
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      Score Awarded: {m.score.obtained}/{m.score.max} Marks
                    </span>
                  )}
                </div>

                {/* Submissions List */}
                {m.submissionFiles && m.submissionFiles.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Uploaded Deliverable Files:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {m.submissionFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-1.5 text-[11px] text-slate-700 dark:text-slate-200 font-medium shadow-2xs"
                        >
                          <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>{file.name}</span>
                          <span className="text-[10px] text-slate-400">({file.size})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {m.feedback && (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Committee Review Feedback:{" "}
                    </span>
                    {m.feedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: TASKBOARD (KANBAN) */}
      {/* ========================================================================= */}
      {currentTab === "kanban" && (
        <section className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#1b7056] dark:text-emerald-400" />
                <span>Agile Sprint Kanban Taskboard</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage backlog, active tasks, code reviews, and deliverables with your squad.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={taskFilterLabel}
                onChange={(e) => setTaskFilterLabel(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Domains</option>
                <option value="Frontend">Frontend</option>
                <option value="API">API</option>
                <option value="DevOps">DevOps</option>
                <option value="Database">Database</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Security">Security</option>
              </select>

              <button
                onClick={() => setShowTaskModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1b7056] hover:bg-[#155a45] text-white px-4 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Task</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-2">
            {kanbanColumns.map((col) => {
              const columnTasks = filteredTasks.filter((t) => t.status === col.id);
              return (
                <div
                  key={col.id}
                  className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-3 min-h-[420px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 px-1">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`}></span>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {col.label}
                      </h3>
                    </div>
                    <span className="rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Tasks Column */}
                  <div className="flex-1 space-y-2.5 overflow-y-auto">
                    {columnTasks.length === 0 ? (
                      <div className="h-36 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-[11px] text-slate-400 text-center p-3">
                        No tasks in {col.label}
                      </div>
                    ) : (
                      columnTasks.map((task) => (
                        <div
                          key={task.id}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-2xs space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadge(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>

                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-slate-300 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                              title="Delete Task"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                            <div
                              className="flex items-center gap-1.5"
                              title={`Assigned to ${task.assignee?.name || "Scholar"}`}
                            >
                              <div className="h-5 w-5 rounded-full bg-[#1b7056] text-white flex items-center justify-center font-bold text-[9px]">
                                {task.assignee?.name
                                  ? task.assignee.name
                                      .split(" ")
                                      .filter(Boolean)
                                      .map((w: string) => w[0])
                                      .join("")
                                      .slice(0, 2)
                                      .toUpperCase()
                                  : "SC"}
                              </div>
                              <span className="truncate max-w-[80px]">
                                {task.assignee?.name ? task.assignee.name.split(" ")[0] : "Assignee"}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => shiftTask(task.id, "prev")}
                                className="h-6 w-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                                title="Move backward"
                              >
                                <ChevronLeft className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => shiftTask(task.id, "next")}
                                className="h-6 w-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                                title="Move forward"
                              >
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: EVALUATION & RUBRICS */}
      {/* ========================================================================= */}
      {currentTab === "rubrics" && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                <span>MES IMCC University Capstone Viva Voce & Evaluation Rubrics</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                100 Marks Institutional Rubrics Matrix prescribed by Department Academic Committee.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-[#1b7056] dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                Total Score: {totalAssignedScore}/{totalMaxScore} ({vivaPct}%)
              </span>
            </div>
          </div>

          {/* Viva Grade Track Box */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-xs">
                  Evaluation Track: {vivaGrade}
                </div>
                <div className="text-[11px] text-slate-500">
                  Adjudicated by Head of Department Dr. Shrikant Joshi & External University Committee.
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300">
              Exam Code: MCA-CAP-2026
            </div>
          </div>

          {/* 5 Criteria Breakdown Grid */}
          <div className="space-y-4">
            {project.rubricCriteria.map((criterion, idx) => (
              <div
                key={criterion.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                      Criterion {idx + 1} • {criterion.weightage} Weightage
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {criterion.title}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-white">
                      {criterion.assignedScore} / {criterion.maxScore} Marks
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {criterion.description}
                </p>

                {/* Score Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1b7056] h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round(((criterion.assignedScore || 0) / criterion.maxScore) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* VIEW 5: TEAM & GUIDES */}
      {/* ========================================================================= */}
      {currentTab === "team" && (
        <section className="space-y-6 animate-in fade-in duration-150">
          {/* Squad Roster Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#1b7056] dark:text-emerald-400" />
                    <span>Capstone Squad Roster & Member Allocation</span>
                  </h2>
                  <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                    {project.teamMembers.length}/{project.maxTeamSize || 4} Members
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  MES IMCC Capstone regulations allow 2 to 4 scholars per squad.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyInviteCode}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  title="Click to copy squad invite code"
                >
                  <span>Passcode: {project.inviteCode || "IMCC-CAP-7942"}</span>
                  <Copy className="h-3 w-3 text-slate-400" />
                </button>

                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#1b7056] hover:bg-[#155a45] text-white px-4 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>+ Invite Teammate</span>
                </button>
              </div>
            </div>

            {/* Member Cards Grid with Open Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {project.teamMembers.map((member) => {
                const isLead = member.role === "Team Lead";
                return (
                  <div
                    key={member.id}
                    className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-5 space-y-3 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-[#1b7056] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              {member.name
                                .split(" ")
                                .filter(Boolean)
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            {isLead && (
                              <div
                                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs"
                                title="Team Lead"
                              >
                                <Crown className="h-2.5 w-2.5 fill-current" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                              <span>{member.name}</span>
                            </div>
                            <div className="font-mono text-[11px] text-slate-500 font-semibold">
                              {member.rollNumber}
                            </div>
                          </div>
                        </div>

                        {/* Role Tag */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            isLead
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                          }`}
                        >
                          {member.role}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 truncate pt-2">
                        {member.email}
                      </div>
                    </div>

                    {/* Inline Member Actions */}
                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-1 text-[11px]">
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.id, e.target.value)}
                        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="Team Lead">Team Lead</option>
                        <option value="Full-Stack Dev">Full-Stack Dev</option>
                        <option value="ML Engineer">ML Engineer</option>
                        <option value="UI/UX Designer">UI/UX Designer</option>
                        <option value="Cloud/DevOps Engineer">DevOps Engineer</option>
                        <option value="QA Engineer">QA Engineer</option>
                      </select>

                      <div className="flex items-center gap-1">
                        {!isLead && (
                          <button
                            onClick={() => handlePromoteLead(member.id)}
                            className="p-1 rounded-md text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                            title="Promote to Team Lead"
                          >
                            <Crown className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {project.teamMembers.length > 1 && (
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Remove from squad"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Open Team Slots for Teammate Formation */}
              {Array.from({ length: Math.max(0, (project.maxTeamSize || 4) - project.teamMembers.length) }).map(
                (_, idx) => {
                  const slotNum = project.teamMembers.length + idx + 1;
                  return (
                    <div
                      key={`open-slot-${slotNum}`}
                      onClick={() => setShowAddMemberModal(true)}
                      className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-emerald-500/60 bg-slate-50/40 dark:bg-slate-900/20 p-5 flex flex-col items-center justify-center text-center space-y-2.5 transition-all group min-h-[160px]"
                    >
                      <div className="h-10 w-10 rounded-full border border-dashed border-slate-300 dark:border-slate-700 group-hover:border-emerald-500 group-hover:bg-emerald-500/10 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                        <UserPlus className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          Open Slot {slotNum} of {project.maxTeamSize || 4}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                          Click to Invite Teammate
                        </div>
                      </div>
                      <div className="text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        Code: {project.inviteCode || "IMCC-CAP-7942"}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Institutional Faculty Guides Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 space-y-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-emerald-600" />
              <span>Department Mentors & Faculty Guides</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.mentors.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 flex items-start gap-3.5"
                >
                  <div className="h-11 w-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {m.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {m.name}
                    </h4>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {m.designation}
                    </p>
                    <p className="text-[10px] text-slate-400">{m.department}</p>
                    <p className="text-[11px] font-mono text-slate-500 pt-1">{m.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* VIEW 6: IEEE / SYNOPSIS DOCS */}
      {/* ========================================================================= */}
      {currentTab === "docs" && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#1b7056] dark:text-emerald-400" />
                <span>IEEE Format & Institutional Academic Documentation</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard templates, SRS specifications, ER schemas, and bound thesis exports.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Doc 1: IEEE Synopsis */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-600">
                  <FileCode2 className="h-4 w-4" />
                  <span className="font-mono text-xs font-bold uppercase">Template 1</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  IEEE Standard Capstone Synopsis Template
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Official IMCC MCA 2-column format with abstract, literature review, and methodology matrix.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="#synopsis-template"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("📥 Downloading IEEE Synopsis Template (IMCC_MCA_Format.docx)...");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3.5 py-2 text-xs font-bold shadow-xs hover:opacity-90"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download IEEE Synopsis (.docx)</span>
                </a>
              </div>
            </div>

            {/* Doc 2: SRS Specification */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-mono text-xs font-bold uppercase">Template 2</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Software Requirement Specification (SRS v1.2)
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Comprehensive functional and non-functional requirements specification conforming to IEEE 830-1998.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="#srs-template"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("📥 Downloading SRS Architecture Specification PDF...");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3.5 py-2 text-xs font-bold shadow-xs hover:opacity-90"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download SRS Blueprint (.pdf)</span>
                </a>
              </div>
            </div>

            {/* Doc 3: Database & ER Diagram */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-600">
                  <Database className="h-4 w-4" />
                  <span className="font-mono text-xs font-bold uppercase">Schema Contract</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Relational PostgreSQL ER Schemas & Contracts
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Supabase database table structures, foreign key constraints, and row-level security (RLS) policies.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="#db-schemas"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("✓ PostgreSQL Schema Contract & ER Diagram loaded!");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>View Database Schemas</span>
                </a>
              </div>
            </div>

            {/* Doc 4: GitHub Repository */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-600">
                  <GitBranch className="h-4 w-4" />
                  <span className="font-mono text-xs font-bold uppercase">Source Code</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Verified Academic Git Repository
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Live code repository connected for verification by Dr. Shrikant Joshi and external university examiners.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={project.repositoryUrl || "https://github.com/parthd45/placeai"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open GitHub Codebase</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD TEAMMATE (MANUAL OR PEERS BROWSER) */}
      {/* ======================================================== */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-emerald-600" />
                  <span>Add Capstone Squad Teammate</span>
                </h3>
                <p className="text-xs text-slate-500">
                  IMCC Capstone guidelines: 2 to 4 scholars per squad.
                </p>
              </div>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAddMemberTab("peers")}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  addMemberTab === "peers"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Select from PlaceAI Cohort
              </button>
              <button
                type="button"
                onClick={() => setAddMemberTab("manual")}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  addMemberTab === "manual"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Add by Details / Roll No
              </button>
            </div>

            {/* Tab 1: Cohort Peer Candidates */}
            {addMemberTab === "peers" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Verified student peers from your college cohort looking for capstone team members:
                </p>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {peerScholars.length === 0 ? (
                    <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
                      <Users className="h-8 w-8 mx-auto text-slate-400 opacity-60" />
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        No peers currently in cohort queue
                      </div>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                        Use the "Add by Details / Roll No" tab to invite a classmate directly by roll number, or share your Squad Passcode (
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {project.inviteCode || "IMCC-CAP-7942"}
                        </span>
                        ).
                      </p>
                    </div>
                  ) : (
                    peerScholars.map((p) => {
                      const alreadyIn = project.teamMembers.some((m) => m.rollNumber === p.rollNumber);
                      return (
                        <div
                          key={p.rollNumber}
                          className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                              {p.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                {p.name}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {p.rollNumber} • {p.role}
                              </div>
                              <div className="flex gap-1 pt-1">
                                {(p.skills || []).slice(0, 2).map((s: string) => (
                                  <span
                                    key={s}
                                    className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded text-slate-600 dark:text-slate-300"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={alreadyIn}
                            onClick={() =>
                              handleAddMember({
                                name: p.name,
                                rollNumber: p.rollNumber,
                                email: p.email,
                                role: p.role,
                                avatar: p.avatar,
                                skills: p.skills,
                              })
                            }
                            className="rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white px-3 py-1.5 text-xs font-bold transition-colors disabled:cursor-not-allowed cursor-pointer"
                          >
                            {alreadyIn ? "In Squad" : "+ Invite"}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Manual Form */}
            {addMemberTab === "manual" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!memberFormName.trim() || !memberFormRoll.trim()) return;
                  handleAddMember({
                    name: memberFormName,
                    rollNumber: memberFormRoll,
                    email: memberFormEmail || `${memberFormRoll.toLowerCase()}@mesimcc.edu.in`,
                    role: memberFormRole,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      memberFormName
                    )}&background=1b7056&color=fff`,
                    skills: memberFormSkills.split(",").map((s) => s.trim()).filter(Boolean),
                  });
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberFormName}
                    onChange={(e) => setMemberFormName(e.target.value)}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={memberFormRoll}
                      onChange={(e) => setMemberFormRoll(e.target.value)}
                      placeholder="e.g. 2401128"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Specialization Role
                    </label>
                    <select
                      value={memberFormRole}
                      onChange={(e) => setMemberFormRole(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="Full-Stack Dev">Full-Stack Dev</option>
                      <option value="ML Engineer">ML Engineer</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="Cloud/DevOps Engineer">DevOps Engineer</option>
                      <option value="QA Engineer">QA Engineer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    value={memberFormEmail}
                    onChange={(e) => setMemberFormEmail(e.target.value)}
                    placeholder="e.g. 2401128@mesimcc.edu.in"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMemberModal(false)}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-bold shadow-md cursor-pointer"
                  >
                    Add Teammate to Squad
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT PROJECT METADATA & REPOSITORY */}
      {/* ======================================================== */}
      {showEditProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-emerald-600" />
                <span>Edit Project Details & Repositories</span>
              </h3>
              <button
                onClick={() => setShowEditProjectModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProjectSettings} className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Capstone Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Problem Statement & Synopsis
                </label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  value={editRepo}
                  onChange={(e) => setEditRepo(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Figma Blueprint URL
                  </label>
                  <input
                    type="url"
                    value={editFigma}
                    onChange={(e) => setEditFigma(e.target.value)}
                    placeholder="https://figma.com/..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Miro Architecture URL
                  </label>
                  <input
                    type="url"
                    value={editMiro}
                    onChange={(e) => setEditMiro(e.target.value)}
                    placeholder="https://miro.com/..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={editTechInput}
                  onChange={(e) => setEditTechInput(e.target.value)}
                  placeholder="Next.js, TypeScript, PostgreSQL..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                {onLeaveSquad && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to exit this squad? You will return to the Team Discovery & Formation portal.")) {
                        setShowEditProjectModal(false);
                        onLeaveSquad();
                      }
                    }}
                    className="rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-2 text-xs font-semibold cursor-pointer"
                  >
                    Leave / Switch Squad
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowEditProjectModal(false)}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-bold shadow-md cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: MILESTONE DELIVERABLE SUBMISSION */}
      {/* ======================================================== */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedMilestone.phase}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedMilestone.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleMilestoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Upload Deliverable Artifact (.zip, .pdf, .docx) *
                </label>
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors">
                  <input
                    type="file"
                    required
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
                        setUploadedFile({
                          name: file.name,
                          size: `${sizeMb} MB`,
                        });
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <UploadCloud className="h-8 w-8 mx-auto text-emerald-600 mb-2" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {uploadedFile ? uploadedFile.name : "Click or drag deliverable archive here"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    IEEE format synopsis, SRS specification, or project codebase (.zip)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Submission Notes for Faculty Guide (Optional)
                </label>
                <textarea
                  rows={2}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Key changes or test results to highlight for Dr. Shrikant Joshi..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMilestone(null)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>Uploading...</span>
                  ) : (
                    <>
                      <FileCheck className="h-3.5 w-3.5" />
                      <span>Submit for Defense</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: CREATE SPRINT KANBAN TASK */}
      {/* ======================================================== */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-600" />
                <span>Create Agile Sprint Task</span>
              </h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Implement WebSocket Handshake"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Acceptance criteria or implementation details..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assignee (Squad Member)
                  </label>
                  <select
                    value={newTaskAssigneeId}
                    onChange={(e) => setNewTaskAssigneeId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  >
                    {project.teamMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role.split(" ")[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="URGENT">URGENT</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Domain Tag
                  </label>
                  <select
                    value={newTaskLabel}
                    onChange={(e) => setNewTaskLabel(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="API">API</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Database">Database</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Security">Security</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Due Date
                  </label>
                  <input
                    type="text"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    placeholder="e.g. Oct 25"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-bold shadow-md cursor-pointer"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
