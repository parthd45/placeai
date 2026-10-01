"use client";

import React, { useState } from "react";
import { ProjectData, Milestone } from "@/lib/types";
import { sampleDepartmentTeams } from "@/lib/mockData";
import {
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Award,
  Users2,
  Calendar,
  Send,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  RotateCcw,
} from "lucide-react";

interface MentorDashboardProps {
  project: ProjectData;
  onUpdateProject: (updated: ProjectData) => void;
}

export function MentorDashboard({
  project,
  onUpdateProject,
}: MentorDashboardProps) {
  const [reviewScore, setReviewScore] = useState<number>(27);
  const [mentorRemarks, setMentorRemarks] = useState<string>(
    "Excellent Kafka consumer throughput benchmark. Verify Docker container limits under memory pressure before external examination."
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  const pendingMilestone = project.milestones.find(
    (m) => m.status === "IN_REVIEW"
  ) || project.milestones[2];

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const updatedMilestones = project.milestones.map((m) => {
        if (m.id === pendingMilestone.id) {
          return {
            ...m,
            status: "COMPLETED" as const,
            score: { obtained: reviewScore, max: 30 },
            feedback: mentorRemarks,
          };
        }
        return m;
      });

      onUpdateProject({
        ...project,
        milestones: updatedMilestones,
        status: "Active",
        progressPercentage: Math.min(100, project.progressPercentage + 15),
      });

      setIsProcessing(false);
      setActionDone("approved");
    }, 700);
  };

  const handleRequestRevision = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const updatedMilestones = project.milestones.map((m) => {
        if (m.id === pendingMilestone.id) {
          return {
            ...m,
            status: "IN_PROGRESS" as const,
            feedback: `Revision requested: ${mentorRemarks}`,
          };
        }
        return m;
      });

      onUpdateProject({
        ...project,
        milestones: updatedMilestones,
        status: "Pending Approval",
      });

      setIsProcessing(false);
      setActionDone("revision");
    }, 700);
  };

  return (
    <div className="space-y-8">
      {/* Faculty Hero Banner */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                Faculty Guide Console
              </span>
              <span className="text-xs text-slate-500">Dr. Shrikant Joshi • Associate Professor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
              Capstone Supervised Teams & Viva Evaluation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Evaluate milestone submissions, grade rubric criteria, schedule departmental viva voce, and provide corrective feedback.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3 text-center">
              <div className="text-xl font-black text-slate-900 dark:text-white">4</div>
              <div className="text-[10px] font-semibold text-slate-500">Assigned Teams</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3 text-center">
              <div className="text-xl font-black text-amber-500">2</div>
              <div className="text-[10px] font-semibold text-slate-500">Submissions Pending</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3 text-center">
              <div className="text-xl font-black text-emerald-500">89.4%</div>
              <div className="text-[10px] font-semibold text-slate-500">Avg Batch Grade</div>
            </div>
          </div>
        </div>
      </section>

      {/* Submissions Pending Review Box */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full bg-amber-500 animate-pulse"></span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Submission for Evaluation: {pendingMilestone?.name}
            </h2>
          </div>
          <span className="rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
            Awaiting Committee Decision
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submission Details */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-500">Project Title:</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {project.name}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Lead: Aarav Sharma (2401098) • SY MCA Division A
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Uploaded Artifacts by Student Team:
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {pendingMilestone?.submissionFiles?.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-200"
                  >
                    <FileCheck className="h-4 w-4 text-emerald-600" />
                    <span>{f.name}</span>
                    <span className="text-slate-400">({f.size})</span>
                  </span>
                )) || (
                  <span className="text-xs text-slate-400">
                    Sprint1_Telemetry_Benchmark_Report.pdf (8.2 MB)
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Guide Evaluation Remarks & Recommendations:
              </label>
              <textarea
                rows={3}
                value={mentorRemarks}
                onChange={(e) => setMentorRemarks(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/20 focus:border-[#2D7F62]"
              ></textarea>
            </div>
          </div>

          {/* Grading & Actions */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-5 flex flex-col justify-between space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Assign Phase Score (Max: 30 pts)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={reviewScore}
                  onChange={(e) => setReviewScore(Number(e.target.value))}
                  className="w-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/20"
                />
                <span className="text-sm font-bold text-slate-500">/ 30 Marks</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Reflects code quality, architecture compliance, and documentation.
              </p>
            </div>

            {actionDone ? (
              <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3 text-center text-xs font-bold text-emerald-700 dark:text-emerald-400">
                Decision recorded! Status updated on student portal.
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1b7056] hover:bg-[#155a45] text-white py-2.5 px-4 text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{isProcessing ? "Recording..." : "Approve & Grade Milestone"}</span>
                </button>

                <button
                  onClick={handleRequestRevision}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 py-2.5 px-4 text-xs font-bold transition-all hover:bg-amber-100 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Request Revisions</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Supervised Teams Roster */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            All Supervised Teams (MES IMCC MCA)
          </h2>
          <span className="text-xs text-slate-500">4 Capstones allocated to Dr. Shrikant Joshi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="pb-3">Project Title</th>
                <th className="pb-3">Batch & Division</th>
                <th className="pb-3">Team Lead</th>
                <th className="pb-3">Progress</th>
                <th className="pb-3">Latest Milestone</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {sampleDepartmentTeams.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                    {t.name}
                  </td>
                  <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-400">{t.batch}</td>
                  <td className="py-3.5 pr-4 font-medium text-slate-800 dark:text-slate-200">
                    {t.lead}
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{t.progress}%</span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-[#1b7056] dark:bg-emerald-500"
                          style={{ width: `${t.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-400">
                    {t.lastSubmission}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        t.pendingAction.includes("Required")
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                          : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                      }`}
                    >
                      {t.pendingAction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
