"use client";

import React, { useState } from "react";
import { ProjectData } from "@/lib/types";
import { sampleDepartmentTeams } from "@/lib/mockData";
import {
  ShieldCheck,
  Building,
  GraduationCap,
  Users2,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  BarChart3,
  Check,
} from "lucide-react";

interface AdminDashboardProps {
  project: ProjectData;
}

export function AdminDashboard({ project }: AdminDashboardProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleExport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const filteredTeams = sampleDepartmentTeams.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.mentor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Toast */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 shadow-2xl border border-slate-800 text-xs font-semibold animate-in fade-in">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>IMCC_MCA_Capstone_Cohort_Report_2026.csv generated & downloaded!</span>
        </div>
      )}

      {/* Admin Hero Banner */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                Institutional Dean Console
              </span>
              <span className="text-xs text-slate-500">MES IMCC Autonomous MCA Program</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
              Academic Cohort Management & Accreditation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Track 84 capstone projects across FY & SY MCA, monitor faculty guide quotas, inspect rubric consistency, and export NAAC/NBA compliance records.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1b7056] hover:bg-[#155a45] text-white px-4 py-2.5 text-xs font-bold shadow-sm transition-all cursor-pointer flex-shrink-0"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export Accreditation CSV</span>
          </button>
        </div>
      </section>

      {/* Institutional KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="metric-card space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Capstones</span>
            <Building className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">84 Projects</div>
          <div className="text-[11px] text-slate-400">42 Teams in Div A • 42 in Div B</div>
        </div>

        <div className="metric-card space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Enrolled Scholars</span>
            <GraduationCap className="h-4 w-4 text-[#1b7056] dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">336 Students</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            100% Roll Numbers Verified
          </div>
        </div>

        <div className="metric-card space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Faculty Mentors</span>
            <Users2 className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">18 Guides</div>
          <div className="text-[11px] text-slate-400">Avg 4.6 Projects per Faculty</div>
        </div>

        <div className="metric-card space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Milestone Compliance</span>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">92.8%</div>
          <div className="text-[11px] text-slate-400">Phase 1 & 2 Completed on Time</div>
        </div>
      </section>

      {/* Master Project Allocation Directory */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Institutional Allocation Roster (SY MCA 2026)
            </h2>
            <p className="text-xs text-slate-500">
              Departmental roster mapping project leads, faculty guides, and current review milestones.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by project or guide..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D7F62]/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="pb-3">Project Title</th>
                <th className="pb-3">Batch</th>
                <th className="pb-3">Team Lead</th>
                <th className="pb-3">Appointed Faculty Guide</th>
                <th className="pb-3">Cohort Progress</th>
                <th className="pb-3">Accreditation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredTeams.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                    {t.name}
                  </td>
                  <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-400">{t.batch}</td>
                  <td className="py-3.5 pr-4 font-semibold text-slate-800 dark:text-slate-200">
                    {t.lead}
                  </td>
                  <td className="py-3.5 pr-4 text-slate-700 dark:text-slate-300 font-medium">
                    {t.mentor}
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
                  <td className="py-3.5">
                    <span className="inline-block rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                      Committee Approved
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
