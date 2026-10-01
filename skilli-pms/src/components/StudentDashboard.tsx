"use client";

import React, { useState } from "react";
import {
  ProjectData,
  Milestone,
  Task,
  TaskStatus,
  TaskPriority,
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
} from "lucide-react";

interface StudentDashboardProps {
  project: ProjectData;
  onUpdateProject: (updated: ProjectData) => void;
}

export function StudentDashboard({
  project,
  onUpdateProject,
}: StudentDashboardProps) {
  // Submission modal state
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null
  );
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New task modal state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>("MEDIUM");
  const [newTaskLabel, setNewTaskLabel] = useState("Frontend");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle milestone submission
  const handleMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const updatedMilestones = project.milestones.map((m) => {
        if (m.id === selectedMilestone.id) {
          return {
            ...m,
            status: "IN_REVIEW" as const,
            submissionFiles: [
              ...(m.submissionFiles || []),
              {
                name: uploadedFileName || "Phase_Deliverable_Artifact_v1.zip",
                size: "4.6 MB",
                url: "#",
                uploadedAt: new Date().toISOString().split("T")[0],
              },
            ],
            feedback: `Submission received with student notes: "${submissionNotes}". Faculty review pending.`,
          };
        }
        return m;
      });

      onUpdateProject({
        ...project,
        milestones: updatedMilestones,
        status: "Under Review",
      });

      setIsSubmitting(false);
      setSelectedMilestone(null);
      setSubmissionNotes("");
      setUploadedFileName("");
      showToast("Deliverables successfully submitted to Dr. Shrikant Joshi for review!");
    }, 900);
  };

  // Move task to next or specific status
  const moveTask = (taskId: string, targetStatus: TaskStatus) => {
    const updatedTasks = project.tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, status: targetStatus };
      }
      return t;
    });
    onUpdateProject({ ...project, tasks: updatedTasks });
    showToast(`Task moved to ${targetStatus}`);
  };

  // Create new task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc || "Self-assigned task for current sprint milestone.",
      status: "TODO",
      priority: newTaskPriority,
      assignee: project.teamMembers[0],
      dueDate: "Oct 12",
      labels: [newTaskLabel],
    };

    onUpdateProject({
      ...project,
      tasks: [newTask, ...project.tasks],
    });

    setNewTaskTitle("");
    setNewTaskDesc("");
    setShowTaskModal(false);
    showToast("New task created on your Kanban board!");
  };

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

  const kanbanColumns: { id: TaskStatus; label: string; dotColor: string }[] = [
    { id: "BACKLOG", label: "Backlog", dotColor: "bg-slate-400" },
    { id: "TODO", label: "To Do", dotColor: "bg-amber-400" },
    { id: "IN_PROGRESS", label: "In Progress", dotColor: "bg-blue-500" },
    { id: "IN_REVIEW", label: "In Review", dotColor: "bg-purple-500" },
    { id: "DONE", label: "Completed", dotColor: "bg-emerald-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 shadow-2xl border border-slate-800 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Project Hero Banner */}
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

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              {project.name}
            </h1>

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

            <a
              href={project.figmaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span>Figma Blueprint</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>

            <button
              onClick={() => setShowTaskModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1b7056] hover:bg-[#155a45] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Create Agile Task</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="metric-card space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Milestone Progress</span>
            <CheckCircle2 className="h-4 w-4 text-[#1b7056] dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {project.progressPercentage}%
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#1b7056] dark:bg-emerald-500"
              style={{ width: `${project.progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-400">Phase 3 in review</div>
        </div>

        <div className="metric-card space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Evaluation Score</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            91 <span className="text-sm font-medium text-slate-400">/ 100</span>
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span>Grade: Distinction (A+)</span>
          </div>
          <div className="text-[11px] text-slate-400">Based on 5 rubric criteria</div>
        </div>

        <div className="metric-card space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Sprint Tasks</span>
            <Layers className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {project.tasks.length}{" "}
            <span className="text-xs font-normal text-slate-400">Active</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {project.tasks.filter((t) => t.status === "DONE").length} completed •{" "}
            {project.tasks.filter((t) => t.status === "IN_PROGRESS").length} in progress
          </div>
          <div className="text-[11px] text-slate-400">Assigned across 4 team scholars</div>
        </div>

        <div className="metric-card space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Next Committee Viva</span>
            <Clock className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            5 Days <span className="text-xs font-normal text-slate-400">Left</span>
          </div>
          <div className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
            Thursday, 2:00 PM • Lab 4
          </div>
          <div className="text-[11px] text-slate-400">Dr. Shrikant Joshi reviewing</div>
        </div>
      </section>

      {/* Project Deliverables & Milestones */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Academic Milestones & Deliverables
            </h2>
            <p className="text-xs text-slate-500">
              Submit your project documentation, code snapshots, and test reports according to institutional deadlines.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {project.milestones.map((milestone, idx) => {
            const isCompleted = milestone.status === "COMPLETED";
            const isInReview = milestone.status === "IN_REVIEW";
            const isInProgress = milestone.status === "IN_PROGRESS";

            return (
              <div
                key={milestone.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        0{idx + 1}
                      </span>
                      <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        {milestone.phase}
                      </span>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                          <Check className="h-3 w-3" /> Approved & Graded ({milestone.score?.obtained}/{milestone.score?.max})
                        </span>
                      )}
                      {isInReview && (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                          <Clock className="h-3 w-3" /> Under Mentor Review
                        </span>
                      )}
                      {isInProgress && (
                        <span className="inline-flex items-center gap-1 rounded bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-400">
                          Active Phase
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {milestone.name}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {milestone.description}
                    </p>

                    {milestone.feedback && (
                      <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2.5 text-xs text-slate-700 dark:text-slate-300 border-l-2 border-[#2D7F62]">
                        <span className="font-bold text-[#1b7056] dark:text-emerald-400">Mentor Remarks: </span>
                        {milestone.feedback}
                      </div>
                    )}

                    {/* Attached files */}
                    {milestone.submissionFiles && milestone.submissionFiles.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] font-bold text-slate-400">Artifacts:</span>
                        {milestone.submissionFiles.map((file, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-2 py-1 text-[11px] font-mono text-slate-700 dark:text-slate-300"
                          >
                            <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                            {file.name} ({file.size})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submission Action */}
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Due Date</div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {milestone.dueDate}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedMilestone(milestone)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-2xs ${
                        isCompleted
                          ? "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                          : "bg-[#1b7056] hover:bg-[#155a45] text-white"
                      }`}
                    >
                      <UploadCloud className="h-4 w-4" />
                      <span>{isCompleted ? "View Submission" : "Submit Deliverables"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Agile Kanban Board */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Agile Sprint Taskboard
            </h2>
            <p className="text-xs text-slate-500">
              Manage work packages, assignees, and sprint deliverables with dynamic status transitions.
            </p>
          </div>

          <button
            onClick={() => setShowTaskModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Plus className="h-4 w-4 text-[#1b7056] dark:text-emerald-400" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {kanbanColumns.map((col) => {
            const colTasks = project.tasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="flex flex-col rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/30 p-3 min-h-[380px]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${col.dotColor}`}></span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {col.label}
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold border ${getPriorityBadge(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>

                        <div className="text-[10px] text-slate-400 font-medium">
                          {task.dueDate}
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {task.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {task.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {task.labels.map((l) => (
                          <span
                            key={l}
                            className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 dark:text-slate-400"
                          >
                            {l}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <div className="h-5 w-5 rounded-full bg-[#1b7056] text-white flex items-center justify-center font-bold text-[9px]">
                            {task.assignee.name.charAt(0)}
                          </div>
                          <span className="text-slate-600 dark:text-slate-400 font-medium truncate max-w-[80px]">
                            {task.assignee.name.split(" ")[0]}
                          </span>
                        </div>

                        {/* Quick state shift buttons */}
                        <div className="flex items-center gap-1">
                          {col.id !== "DONE" && (
                            <button
                              onClick={() => {
                                const nextColMap: Record<TaskStatus, TaskStatus> = {
                                  BACKLOG: "TODO",
                                  TODO: "IN_PROGRESS",
                                  IN_PROGRESS: "IN_REVIEW",
                                  IN_REVIEW: "DONE",
                                  DONE: "DONE",
                                };
                                moveTask(task.id, nextColMap[col.id]);
                              }}
                              title="Move to next stage"
                              className="rounded p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="h-32 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-[11px] text-slate-400">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Rubric Evaluation Breakdown */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Institutional Rubric Evaluation
            </h2>
            <p className="text-xs text-slate-500">
              Formal assessment breakdown governed by the IMCC MCA Capstone Examination Committee.
            </p>
          </div>
          <div className="rounded-xl bg-[#2D7F62]/10 border border-[#2D7F62]/30 px-3 py-1.5 text-xs font-bold text-[#1b7056] dark:text-emerald-400 flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>Cumulative: 91 / 100 (Distinction)</span>
          </div>
        </div>

        <div className="space-y-3.5">
          {project.rubricCriteria.map((criterion) => {
            const percentage = Math.round(
              (criterion.assignedScore / criterion.maxScore) * 100
            );
            return (
              <div
                key={criterion.id}
                className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 p-4 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{criterion.title}</span>
                    <span className="text-[10px] font-medium text-slate-400">
                      (Weight: {criterion.weightage})
                    </span>
                  </div>
                  <div className="font-mono font-bold text-[#1b7056] dark:text-emerald-400">
                    {criterion.assignedScore} / {criterion.maxScore} pts ({percentage}%)
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {criterion.description}
                </p>

                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1b7056] dark:bg-emerald-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team Roster & Faculty Mentors */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Members */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Student Project Scholars ({project.teamMembers.length})
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">Roll Numbers</span>
          </div>

          <div className="space-y-3">
            {project.teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800/60 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#1b7056] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {member.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{member.role}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                    {member.rollNumber}
                  </div>
                  <div className="text-[10px] text-slate-400">{member.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Mentors */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Assigned Faculty & Industry Guides
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">Mentorship</span>
          </div>

          <div className="space-y-3">
            {project.mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800/60 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {mentor.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {mentor.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{mentor.designation}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    {mentor.department}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">{mentor.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submission Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {selectedMilestone.phase}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedMilestone.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleMilestoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Deliverable Artifact File (.zip, .pdf, or repo link)
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:border-[#2D7F62] transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/40">
                  <UploadCloud className="h-8 w-8 text-[#1b7056] dark:text-emerald-400 mx-auto mb-2" />
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Click to select file or drag and drop
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    IEEE SRS, Architecture Blueprint, Benchmark reports (Max 50MB)
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    id="milestone-file"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setUploadedFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  <label
                    htmlFor="milestone-file"
                    className="mt-3 inline-block rounded-lg bg-slate-200 dark:bg-slate-700 px-3 py-1.5 text-xs font-bold cursor-pointer"
                  >
                    {uploadedFileName || "Browse Files"}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Submission Summary Notes for Guide / Mentor
                </label>
                <textarea
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Outline key accomplishments, benchmark scores, or specific sections requiring feedback..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/20 focus:border-[#2D7F62]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMilestone(null)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#1b7056] hover:bg-[#155a45] text-white px-5 py-2.5 text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Confirm & Submit to Committee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Create Sprint Task
              </h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Implement WebSocket JWT Handshake"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/20 focus:border-[#2D7F62]"
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
                  placeholder="Specific requirements or acceptance criteria..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/20 focus:border-[#2D7F62]"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/20"
                  >
                    <option value="URGENT">URGENT</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Domain Label
                  </label>
                  <select
                    value={newTaskLabel}
                    onChange={(e) => setNewTaskLabel(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/20"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="API">API</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Security">Security</option>
                    <option value="Database">Database</option>
                    <option value="Testing">Testing</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1b7056] hover:bg-[#155a45] text-white px-5 py-2 text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Add to Kanban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
