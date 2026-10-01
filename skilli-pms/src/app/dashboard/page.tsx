"use client";

import React, { useState, useEffect } from "react";
import { UserRole, ProjectData, StudentUser } from "@/lib/types";
import { initialProject } from "@/lib/mockData";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { StudentDashboard } from "@/components/StudentDashboard";
import { MentorDashboard } from "@/components/MentorDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import { Sparkles, CheckCircle2, ShieldCheck, ExternalLink, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [currentRole, setCurrentRole] = useState<UserRole>("STUDENT");
  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState<ProjectData>(initialProject);
  const [user, setUser] = useState<StudentUser | null>(null);

  // High-tech SSO Authentication Loading State
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState("Verifying PlaceAI Session...");
  const [authProgress, setAuthProgress] = useState(25);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Restore saved project state from localStorage if present
    try {
      const savedProjRaw = localStorage.getItem("placeai_pms_project_data");
      if (savedProjRaw) {
        const savedProj = JSON.parse(savedProjRaw);
        if (savedProj && savedProj.name && Array.isArray(savedProj.teamMembers)) {
          setProject(savedProj);
        }
      }
    } catch (e) {}

    let detectedUser: StudentUser | null = null;
    let isSsoFlow = false;

    // 1. Read token or sso flag from URL query string
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const ssoParam = urlParams.get("sso");

      if (token) {
        try {
          const decoded = decodeURIComponent(escape(atob(decodeURIComponent(token))));
          detectedUser = JSON.parse(decoded);
          isSsoFlow = true;
        } catch (tokErr) {
          console.warn("Could not decode sso token:", tokErr);
        }
      } else if (ssoParam) {
        isSsoFlow = true;
      }
    } catch (e) {}

    // 2. Read from shared localStorage bridge
    if (!detectedUser) {
      try {
        const storedBridge = localStorage.getItem("placeai_pms_authenticated_user");
        if (storedBridge) {
          detectedUser = JSON.parse(storedBridge);
        }
      } catch (e) {}
    }

    // 3. Fallback to native PlaceAI profile in localStorage (same origin)
    if (!detectedUser) {
      try {
        const placeaiProfileRaw = localStorage.getItem("placeai_profile");
        const placeaiUserRaw =
          localStorage.getItem("placeai_current_user") ||
          localStorage.getItem("placeai_phone_user");

        if (placeaiProfileRaw || placeaiUserRaw) {
          const p = placeaiProfileRaw ? JSON.parse(placeaiProfileRaw) : {};
          const u = placeaiUserRaw ? JSON.parse(placeaiUserRaw) : {};
          const userObj = u.user || u;
          const meta =
            (userObj && (userObj.user_metadata || userObj.raw_user_meta_data)) || {};

          const fName =
            p.first_name ||
            meta.first_name ||
            (userObj.email ? userObj.email.split("@")[0] : "Candidate");
          const lName = p.last_name || meta.last_name || "";
          const fFullName = `${fName} ${lName}`.trim() || "Candidate Scholar";
          const fEmail = p.email || userObj.email || "student@mesimcc.edu.in";
          const fRoll =
            p.roll_number ||
            (p.education && p.education[0]?.roll_number) ||
            "2401" +
              Math.abs(
                fEmail.split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0) %
                  900 +
                  100
              );
          const fDept =
            (p.education && p.education[0]?.course) ||
            "Department of Computer Applications (MCA)";
          const fCollege =
            (p.education && p.education[0]?.college) || "MES IMCC College, Pune";

          detectedUser = {
            id: userObj.id || p.user_id || "usr_" + Date.now(),
            name: fFullName,
            email: fEmail,
            rollNumber: fRoll,
            department: fDept,
            college: fCollege,
            division: "Division A",
            avatar:
              p.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(fFullName)}&background=1b7056&color=fff`,
            skills: p.skills || ["React", "TypeScript", "Node.js", "PostgreSQL"],
            githubUrl:
              p.github_url || localStorage.getItem("placeai_connected_github") || "",
            isPlaceAiAuth: true,
          };
        }
      } catch (e) {}
    }

    // Apply the student data to user state and project
    if (detectedUser) {
      setUser(detectedUser);
      try {
        localStorage.setItem("placeai_pms_authenticated_user", JSON.stringify(detectedUser));
      } catch (e) {}

      // Update Capstone project details with student's profile & repository
      setProject((prev) => {
        const updatedTeam = [...prev.teamMembers];
        if (updatedTeam.length > 0) {
          updatedTeam[0] = {
            ...updatedTeam[0],
            id: detectedUser!.id,
            name: detectedUser!.name,
            email: detectedUser!.email,
            rollNumber: detectedUser!.rollNumber,
            avatar: detectedUser!.avatar,
            role: "Team Lead",
          };
        }
        return {
          ...prev,
          department: detectedUser!.department || prev.department,
          repositoryUrl: detectedUser!.githubUrl || prev.repositoryUrl,
          teamMembers: updatedTeam,
        };
      });

      // Show authenticating loading sequence if arriving from PlaceAI SSO
      if (isSsoFlow) {
        setIsAuthenticating(true);
        setAuthStep("Verifying PlaceAI Institutional Credentials...");
        setAuthProgress(30);

        const t1 = setTimeout(() => {
          setAuthStep("Transferring Student Profile & Repository Workspace...");
          setAuthProgress(70);
        }, 400);

        const t2 = setTimeout(() => {
          setAuthStep(`Authenticated: ${detectedUser!.name} (${detectedUser!.rollNumber})`);
          setAuthProgress(100);
        }, 850);

        const t3 = setTimeout(() => {
          setIsAuthenticating(false);
        }, 1300);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
        };
      }
    }
  }, []);

  const handleUpdateProject = (updated: ProjectData) => {
    setProject(updated);
    try {
      localStorage.setItem("placeai_pms_project_data", JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to persist project to localStorage:", e);
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === "STUDENT") {
      setActiveTab("overview");
    } else if (role === "MENTOR") {
      setActiveTab("mentor-submissions");
    } else {
      setActiveTab("admin-analytics");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--background))] text-[hsl(var(--foreground))] transition-colors relative">
      {/* High-Tech SSO Authentication Overlay */}
      {isAuthenticating && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 transition-all">
          <div className="max-w-md w-full rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-8 shadow-2xl flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Animated Brand Ring */}
            <div className="relative flex items-center justify-center">
              <div className="absolute h-20 w-20 rounded-full border-2 border-emerald-500/20 animate-ping" />
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#1b7056] to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-400">
                <Sparkles className="h-3 w-3 text-emerald-400" />
                <span>PlaceAI Institutional SSO Bridge</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Authenticating Student Profile
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {authStep}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full space-y-2">
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-[#1b7056] transition-all duration-300 ease-out"
                  style={{ width: `${authProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                <span>PlaceAI Identity</span>
                <span>{authProgress}%</span>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="w-full text-left space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Candidate Identity & Roll Number Verified</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Academic Capstone Repository Connected</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                <span>Launching Capstone Dashboard...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeView={activeTab}
        user={user}
      />

      {/* Main Body with Sidebar + Workspace View */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          progressPercentage={project.progressPercentage}
        />

        {/* Content Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Top PlaceAI SSO Active Banner */}
            {user?.isPlaceAiAuth && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-[#1b7056] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <span>PlaceAI Student SSO Connected</span>
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded">
                        Active
                      </span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 font-medium">
                      <span>{user.name}</span>
                      <span className="text-slate-400 mx-1.5">•</span>
                      <span>Roll No: {user.rollNumber}</span>
                      <span className="text-slate-400 mx-1.5">•</span>
                      <span>{user.email}</span>
                      <span className="text-slate-400 mx-1.5">•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{user.department}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="/dashboard.html"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors shadow-2xs"
                  >
                    <span>Return to PlaceAI Profile</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}

            {/* View Switching based on Active Role */}
            {currentRole === "STUDENT" && (
              <StudentDashboard
                project={project}
                onUpdateProject={handleUpdateProject}
              />
            )}

            {currentRole === "MENTOR" && (
              <MentorDashboard
                project={project}
                onUpdateProject={handleUpdateProject}
              />
            )}

            {(currentRole === "DEPARTMENT_ADMIN" ||
              currentRole === "ORGANIZATION_ADMIN") && (
              <AdminDashboard project={project} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
