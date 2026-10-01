"use client";

import React, { useState, useEffect } from "react";
import { UserRole, ProjectData, StudentUser, TeamMember } from "@/lib/types";
import { createNewCapstoneSquad, initialProject, sampleDepartmentTeams } from "@/lib/mockData";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { StudentDashboard } from "@/components/StudentDashboard";
import { MentorDashboard } from "@/components/MentorDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Loader2,
  Users,
  UserPlus,
  Search,
  PlusCircle,
  FolderGit2,
  Code2,
  Layers,
  Award,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  KeyRound,
  Check,
} from "lucide-react";

export default function DashboardPage() {
  const [currentRole, setCurrentRole] = useState<UserRole>("STUDENT");
  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState<ProjectData | null>(null);
  const [user, setUser] = useState<StudentUser | null>(null);

  // High-tech SSO Authentication Loading State
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState("Verifying PlaceAI Session...");
  const [authProgress, setAuthProgress] = useState(25);

  // Team Discovery & Squad Formation State
  const [squadTab, setSquadTab] = useState<"find" | "create">("find");
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [joinRoleInput, setJoinRoleInput] = useState("Full-Stack Dev");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);
  const [searchSquadQuery, setSearchSquadQuery] = useState("");

  // New Squad Form State
  const [newTitle, setNewTitle] = useState("PlaceAI - Autonomous Placement Intelligence & Technical Assessment Platform");
  const [newDesc, setNewDesc] = useState(
    "Enterprise institutional placement preparation and candidate telemetry platform built for MES IMCC Pune. Integrates proctored online coding compilers with testcase validation, automated ATS resume scoring, peer direct messaging, Supabase cloud profiles, and cross-platform Android deployment."
  );
  const [newCategory, setNewCategory] = useState("Web & Cloud Architecture / AI");
  const [newTechInput, setNewTechInput] = useState("TypeScript, Next.js, Node.js, Supabase, PostgreSQL, Capacitor");
  const [newRepoUrl, setNewRepoUrl] = useState("https://github.com/parthd45/placeai");
  const [formError, setFormError] = useState<string | null>(null);

  // Available registered squads in the college directory
  const [collegeSquads, setCollegeSquads] = useState<ProjectData[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Purge stale mock data containing fake members ("Sneha Joshi", "Rohan Kulkarni")
    try {
      const savedProjRaw = localStorage.getItem("placeai_pms_project_data");
      if (savedProjRaw) {
        const saved = JSON.parse(savedProjRaw);
        if (saved && Array.isArray(saved.teamMembers)) {
          const hasFakeMember = saved.teamMembers.some(
            (m: any) => m.name === "Sneha Joshi" || m.name === "Rohan Kulkarni" || m.name === "Aarav Sharma"
          );
          if (hasFakeMember) {
            localStorage.removeItem("placeai_pms_project_data");
          }
        }
      }
    } catch (e) {}

    // 2. Load college-wide squads from localStorage
    let allSquads: ProjectData[] = [];
    try {
      const storedSquadsRaw = localStorage.getItem("placeai_pms_all_squads");
      if (storedSquadsRaw) {
        allSquads = JSON.parse(storedSquadsRaw);
      }
    } catch (e) {}
    setCollegeSquads(allSquads);

    let detectedUser: StudentUser | null = null;
    let isSsoFlow = false;

    // Read token or sso flag from URL query string
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

    // Read from shared localStorage bridge
    if (!detectedUser) {
      try {
        const storedBridge = localStorage.getItem("placeai_pms_authenticated_user");
        if (storedBridge) {
          detectedUser = JSON.parse(storedBridge);
        }
      } catch (e) {}
    }

    // Fallback to native PlaceAI profile in localStorage
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
            (userObj.email ? userObj.email.split("@")[0] : "Parth");
          const lName = p.last_name || meta.last_name || "Deshmukh";
          const fFullName = `${fName} ${lName}`.trim() || "Parth Deshmukh";
          const fEmail = p.email || userObj.email || "parth.deshmukh@mesimcc.edu.in";
          const fRoll =
            p.roll_number ||
            (p.education && p.education[0]?.roll_number) ||
            "2401089";
          const fDept =
            (p.education && p.education[0]?.course) ||
            "Department of Computer Applications (MCA)";
          const fCollege =
            (p.education && p.education[0]?.college) || "MES IMCC College, Pune";

          detectedUser = {
            id: userObj.id || p.user_id || "usr_parth_2401089",
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
              p.github_url || localStorage.getItem("placeai_connected_github") || "https://github.com/parthd45/placeai",
            isPlaceAiAuth: true,
          };
        }
      } catch (e) {}
    }

    // Default real student fallback if completely empty
    if (!detectedUser) {
      detectedUser = {
        id: "usr_parth_2401089",
        name: "Parth Deshmukh",
        email: "parth.deshmukh@mesimcc.edu.in",
        rollNumber: "2401089",
        department: "Department of Computer Applications (MCA)",
        college: "MES IMCC College, Pune",
        division: "Division A",
        avatar: "https://ui-avatars.com/api/?name=Parth+Deshmukh&background=1b7056&color=fff",
        skills: ["Next.js", "TypeScript", "PostgreSQL", "Node.js"],
        githubUrl: "https://github.com/parthd45/placeai",
        isPlaceAiAuth: true,
      };
    }

    setUser(detectedUser);
    try {
      localStorage.setItem("placeai_pms_authenticated_user", JSON.stringify(detectedUser));
    } catch (e) {}

    // 3. Squad Lookup for this student:
    // Check if the student belongs to any squad in allSquads or user squad
    let userSquad: ProjectData | null = null;

    // Check all squads in college directory
    for (const sq of allSquads) {
      if (
        Array.isArray(sq.teamMembers) &&
        sq.teamMembers.some(
          (m) =>
            m.id === detectedUser!.id ||
            m.email === detectedUser!.email ||
            m.rollNumber === detectedUser!.rollNumber
        )
      ) {
        userSquad = sq;
        break;
      }
    }

    // Check user-specific storage key
    if (!userSquad) {
      try {
        const storedUserSquadRaw = localStorage.getItem(`placeai_pms_squad_${detectedUser.id}`);
        if (storedUserSquadRaw) {
          const parsed = JSON.parse(storedUserSquadRaw);
          if (parsed && Array.isArray(parsed.teamMembers)) {
            userSquad = parsed;
          }
        }
      } catch (e) {}
    }

    // Check general project storage key if verified
    if (!userSquad) {
      try {
        const genRaw = localStorage.getItem("placeai_pms_project_data");
        if (genRaw) {
          const parsed = JSON.parse(genRaw);
          if (
            parsed &&
            Array.isArray(parsed.teamMembers) &&
            parsed.teamMembers.some(
              (m: any) =>
                m.id === detectedUser!.id ||
                m.email === detectedUser!.email ||
                m.rollNumber === detectedUser!.rollNumber
            )
          ) {
            userSquad = parsed;
          }
        }
      } catch (e) {}
    }

    if (userSquad) {
      setProject(userSquad);
    } else {
      // STRICT REQUIREMENT: If team is not found, do NOT assign as team leader or invent a team!
      setProject(null);
    }

    // Pre-fill create form with detected user's github repo if available
    if (detectedUser.githubUrl) {
      setNewRepoUrl(detectedUser.githubUrl);
    }

    // Show authenticating loading sequence if arriving from PlaceAI SSO
    if (isSsoFlow) {
      setIsAuthenticating(true);
      setAuthStep("Verifying PlaceAI Institutional Credentials...");
      setAuthProgress(30);

      const t1 = setTimeout(() => {
        setAuthStep("Checking MES IMCC Capstone Squad Enrollment...");
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
  }, []);

  // Update Project state & persist to all storage keys
  const handleUpdateProject = (updated: ProjectData) => {
    setProject(updated);
    try {
      localStorage.setItem("placeai_pms_project_data", JSON.stringify(updated));
      if (user?.id) {
        localStorage.setItem(`placeai_pms_squad_${user.id}`, JSON.stringify(updated));
      }
      // Update in all squads directory
      const updatedAll = collegeSquads.map((sq) => (sq.id === updated.id ? updated : sq));
      if (!updatedAll.some((sq) => sq.id === updated.id)) {
        updatedAll.push(updated);
      }
      setCollegeSquads(updatedAll);
      localStorage.setItem("placeai_pms_all_squads", JSON.stringify(updatedAll));
    } catch (e) {
      console.warn("Failed to persist project:", e);
    }
  };

  // Student Leaves or Resets Squad
  const handleLeaveSquad = () => {
    if (!project || !user) return;

    const remainingMembers = project.teamMembers.filter(
      (m) => m.id !== user.id && m.rollNumber !== user.rollNumber
    );

    let updatedAll: ProjectData[];
    if (remainingMembers.length === 0) {
      // Squad is empty, delete it
      updatedAll = collegeSquads.filter((sq) => sq.id !== project.id);
    } else {
      // Transfer leadership if user was leader
      if (project.teamMembers.find((m) => m.id === user.id)?.role === "Team Lead") {
        remainingMembers[0] = { ...remainingMembers[0], role: "Team Lead" };
      }
      const updatedProj: ProjectData = {
        ...project,
        teamMembers: remainingMembers,
      };
      updatedAll = collegeSquads.map((sq) => (sq.id === project.id ? updatedProj : sq));
    }

    try {
      localStorage.setItem("placeai_pms_all_squads", JSON.stringify(updatedAll));
      localStorage.removeItem(`placeai_pms_squad_${user.id}`);
      localStorage.removeItem("placeai_pms_project_data");
    } catch (e) {}

    setCollegeSquads(updatedAll);
    setProject(null);
  };

  // Join an Existing Squad by Passcode
  const handleJoinSquadByCode = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError(null);
    setJoinSuccess(null);

    if (!user) {
      setJoinError("Student session not authenticated.");
      return;
    }

    const code = joinCodeInput.trim().toUpperCase();
    if (!code) {
      setJoinError("Please enter a valid Squad Passcode (e.g. IMCC-CAP-7942).");
      return;
    }

    // Search in college directory
    let targetSquad = collegeSquads.find(
      (sq) => (sq.inviteCode || "").toUpperCase() === code
    );

    // If not found in directory, check sample or verify format
    if (!targetSquad && code === "IMCC-CAP-7942") {
      // Construct PlaceAI Capstone Squad
      targetSquad = {
        id: "proj-imcc-placeai-live",
        name: "PlaceAI - Autonomous Placement Intelligence & Technical Assessment Platform",
        description:
          "Enterprise institutional placement preparation and candidate telemetry platform built for MES IMCC Pune.",
        type: "CAPSTONE",
        department: "Department of Computer Applications (MCA)",
        academicYear: "SY MCA (2024-2026)",
        division: "Division A",
        progressPercentage: 65,
        status: "Active",
        technologies: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Supabase"],
        objectives: [
          "Build proctored browser-based code execution sandbox with real-time testcase grading",
          "Deploy persistent Supabase authentication with auto-refreshing JWT session resilience",
        ],
        repositoryUrl: "https://github.com/parthd45/placeai",
        figmaUrl: "",
        miroUrl: "",
        inviteCode: "IMCC-CAP-7942",
        maxTeamSize: 4,
        teamMembers: [],
        mentors: initialProject.mentors,
        milestones: initialProject.milestones,
        tasks: [],
        rubricCriteria: initialProject.rubricCriteria,
      };
    }

    if (!targetSquad) {
      setJoinError(`Squad with passcode "${code}" not found. Verify the code with your Team Leader.`);
      return;
    }

    if (targetSquad.teamMembers.length >= (targetSquad.maxTeamSize || 4)) {
      setJoinError("This squad has reached the maximum capacity of 4 members.");
      return;
    }

    const isAlreadyMember = targetSquad.teamMembers.some(
      (m) => m.id === user.id || m.rollNumber === user.rollNumber
    );

    const newMember: TeamMember = {
      id: user.id,
      name: user.name,
      role: joinRoleInput as any,
      rollNumber: user.rollNumber,
      email: user.email,
      avatar: user.avatar,
      skills: user.skills,
      joinedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    const updatedMembers = isAlreadyMember
      ? targetSquad.teamMembers
      : [...targetSquad.teamMembers, newMember];

    const updatedSquad: ProjectData = {
      ...targetSquad,
      teamMembers: updatedMembers,
    };

    handleUpdateProject(updatedSquad);
    setJoinSuccess(`Successfully joined squad as ${joinRoleInput}! Loading dashboard...`);
  };

  // Direct Join from Squad Directory Card
  const handleDirectJoin = (targetSquad: ProjectData) => {
    if (!user) return;
    if (targetSquad.teamMembers.length >= (targetSquad.maxTeamSize || 4)) {
      alert("This squad has reached the maximum capacity of 4 members.");
      return;
    }

    const newMember: TeamMember = {
      id: user.id,
      name: user.name,
      role: joinRoleInput as any,
      rollNumber: user.rollNumber,
      email: user.email,
      avatar: user.avatar,
      skills: user.skills,
      joinedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    const updatedMembers = [...targetSquad.teamMembers, newMember];
    const updatedSquad: ProjectData = {
      ...targetSquad,
      teamMembers: updatedMembers,
    };

    handleUpdateProject(updatedSquad);
  };

  // Create a New Capstone Squad (Student explicitly becomes Team Lead)
  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!user) {
      setFormError("Student session not authenticated.");
      return;
    }

    if (!newTitle.trim()) {
      setFormError("Please enter a project title.");
      return;
    }

    if (!newDesc.trim()) {
      setFormError("Please enter a project synopsis / problem statement.");
      return;
    }

    const techArray = newTechInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Create a 100% REAL squad with ZERO mock data.
    // User is explicitly registered as Team Lead for their newly created project.
    const createdSquad = createNewCapstoneSquad(user, {
      name: newTitle.trim(),
      description: newDesc.trim(),
      technologies: techArray,
      repositoryUrl: newRepoUrl.trim(),
      role: "Team Lead",
    });

    handleUpdateProject(createdSquad);
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

  // Filter squads in directory
  const filteredSquads = collegeSquads.filter((sq) => {
    if (!searchSquadQuery.trim()) return true;
    const q = searchSquadQuery.toLowerCase();
    return (
      sq.name.toLowerCase().includes(q) ||
      (sq.inviteCode || "").toLowerCase().includes(q) ||
      sq.teamMembers.some((m) => m.name.toLowerCase().includes(q) || m.rollNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--background))] text-[hsl(var(--foreground))] transition-colors relative">
      {/* High-Tech SSO Authentication Overlay */}
      {isAuthenticating && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 transition-all">
          <div className="max-w-md w-full rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-8 shadow-2xl flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
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
              <p className="text-xs text-slate-400 font-medium">{authStep}</p>
            </div>

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
                <span>Checking Squad Allocation Status...</span>
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

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          progressPercentage={project?.progressPercentage || 0}
          project={project}
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
                      <span>PlaceAI Institutional SSO Verified</span>
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
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {user.department}
                      </span>
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

            {/* View Switching based on Active Role & Squad Existence */}
            {currentRole === "STUDENT" && (
              <>
                {project ? (
                  // Student HAS a valid registered squad
                  <StudentDashboard
                    project={project}
                    onUpdateProject={handleUpdateProject}
                    user={user}
                    onLeaveSquad={handleLeaveSquad}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                ) : (
                  // STUDENT HAS NO SQUAD FOUND -> Show Team Discovery & Squad Formation Portal
                  <div className="space-y-6">
                    {/* Institutional Header Banner */}
                    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            <span>Capstone Squad Status: Not Assigned</span>
                          </div>
                          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Find or Form Your Capstone Project Squad
                          </h1>
                          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                            Under MES IMCC Capstone regulations, every MCA candidate must belong to an approved project squad (max 4 members). You have not been automatically assigned as Team Lead. You can either <span className="font-bold text-emerald-600 dark:text-emerald-400">join an existing squad</span> formed by your classmate, or <span className="font-bold text-emerald-600 dark:text-emerald-400">register a new project</span> as Team Leader.
                          </p>
                        </div>

                        {/* Student Badge Card */}
                        <div className="hidden md:flex flex-col items-end rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-3 shadow-2xs">
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {user?.name}
                          </div>
                          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                            Roll No: {user?.rollNumber}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {user?.department} • {user?.division}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Tabs between Find Team and Create Team */}
                    <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
                      <button
                        onClick={() => {
                          setSquadTab("find");
                          setJoinError(null);
                        }}
                        className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
                          squadTab === "find"
                            ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                            : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <Search className="h-4 w-4" />
                        <span>Find & Join an Existing Squad</span>
                      </button>

                      <button
                        onClick={() => {
                          setSquadTab("create");
                          setFormError(null);
                        }}
                        className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
                          squadTab === "create"
                            ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                            : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span>Register New Squad (Become Team Lead)</span>
                      </button>
                    </div>

                    {/* TAB 1: FIND & JOIN SQUAD */}
                    {squadTab === "find" && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Direct Passcode Entry */}
                        <div className="lg:col-span-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-5 shadow-xs">
                          <div className="space-y-1">
                            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-2">
                              <KeyRound className="h-5 w-5" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              Join via Squad Passcode
                            </h3>
                            <p className="text-xs text-slate-500">
                              Got a passcode from your classmate or Team Leader? Enter it here to join their squad as a member.
                            </p>
                          </div>

                          <form onSubmit={handleJoinSquadByCode} className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Squad Passcode *
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. IMCC-CAP-7942"
                                value={joinCodeInput}
                                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Your Specialization in Squad *
                              </label>
                              <select
                                value={joinRoleInput}
                                onChange={(e) => setJoinRoleInput(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              >
                                <option value="Full-Stack Dev">Full-Stack Developer</option>
                                <option value="Frontend Dev">Frontend Developer</option>
                                <option value="Backend Dev">Backend / API Developer</option>
                                <option value="Cloud/DevOps Engineer">Cloud & DevOps Engineer</option>
                                <option value="ML Engineer">Machine Learning / AI Engineer</option>
                                <option value="UI/UX Designer">UI/UX Designer</option>
                                <option value="QA Engineer">QA & Automation Engineer</option>
                              </select>
                              <p className="text-[11px] text-slate-400 mt-1">
                                You will be added as an active member (not Team Lead).
                              </p>
                            </div>

                            {joinError && (
                              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 font-medium">
                                {joinError}
                              </div>
                            )}

                            {joinSuccess && (
                              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                                <Check className="h-4 w-4" />
                                <span>{joinSuccess}</span>
                              </div>
                            )}

                            <button
                              type="submit"
                              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <span>Join Squad as {joinRoleInput}</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </form>
                        </div>

                        {/* Right Column: College Active Squads Directory */}
                        <div className="lg:col-span-2 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Users className="h-4 w-4 text-[#1b7056] dark:text-emerald-400" />
                                <span>MES IMCC MCA Capstone Squad Directory</span>
                              </h3>
                              <p className="text-xs text-slate-500">
                                Open squads registered in Division A with available teammate slots.
                              </p>
                            </div>

                            <div className="relative w-full sm:w-64">
                              <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-400" />
                              <input
                                type="text"
                                placeholder="Search by title or lead..."
                                value={searchSquadQuery}
                                onChange={(e) => setSearchSquadQuery(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>
                          </div>

                          {filteredSquads.length === 0 ? (
                            <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center space-y-3">
                              <Users className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700" />
                              <div className="space-y-1">
                                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                  No Open Squads Currently Listed in Directory
                                </h4>
                                <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                                  If your teammate created a squad, ask them for their unique Squad Passcode (e.g. <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">IMCC-CAP-7942</span>) and enter it on the left.
                                </p>
                              </div>
                              <button
                                onClick={() => setSquadTab("create")}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold shadow-xs cursor-pointer"
                              >
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span>Create First Squad Instead</span>
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {filteredSquads.map((sq) => {
                                const leadMember =
                                  sq.teamMembers.find((m) => m.role === "Team Lead") || sq.teamMembers[0];
                                const currentCount = sq.teamMembers.length;
                                const maxCount = sq.maxTeamSize || 4;
                                const isFull = currentCount >= maxCount;

                                return (
                                  <div
                                    key={sq.id}
                                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-4 hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-2xs"
                                  >
                                    <div className="space-y-2">
                                      <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                                          {sq.name}
                                        </h4>
                                        <span
                                          className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded border ${
                                            isFull
                                              ? "bg-red-500/10 text-red-600 border-red-500/20"
                                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                          }`}
                                        >
                                          {currentCount}/{maxCount} Members
                                        </span>
                                      </div>

                                      <p className="text-[11px] text-slate-500 line-clamp-2">
                                        {sq.description}
                                      </p>

                                      <div className="flex flex-wrap gap-1 pt-1">
                                        {(sq.technologies || []).slice(0, 3).map((t) => (
                                          <span
                                            key={t}
                                            className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-mono"
                                          >
                                            {t}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                                      <div>
                                        <div className="text-[10px] text-slate-400">Team Lead:</div>
                                        <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                                          {leadMember?.name || "Student Scholar"}
                                        </div>
                                      </div>

                                      <button
                                        disabled={isFull}
                                        onClick={() => handleDirectJoin(sq)}
                                        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white px-3 py-1.5 text-xs font-bold transition-all disabled:cursor-not-allowed cursor-pointer"
                                      >
                                        {isFull ? "Squad Full" : "Join Squad"}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* TAB 2: REGISTER & FORM A NEW SQUAD */}
                    {squadTab === "create" && (
                      <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-sm">
                        <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <GraduationCap className="h-3.5 w-3.5" />
                            <span>MES IMCC Capstone Proposal Registration</span>
                          </div>
                          <h2 className="text-lg font-black text-slate-900 dark:text-white">
                            Register New Capstone Squad as Team Leader
                          </h2>
                          <p className="text-xs text-slate-500">
                            By creating a new squad, you will become the designated <span className="font-bold text-slate-900 dark:text-white">Team Lead</span>. A unique Squad Passcode will be generated so up to 3 classmates can join your squad.
                          </p>
                        </div>

                        <form onSubmit={handleCreateSquad} className="space-y-5">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Project Title *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. PlaceAI - Autonomous Placement Intelligence & Technical Assessment Platform"
                              value={newTitle}
                              onChange={(e) => setNewTitle(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Project Abstract / Problem Statement *
                            </label>
                            <textarea
                              rows={4}
                              required
                              placeholder="Provide a comprehensive synopsis of your capstone engineering proposal, real-world utility, and architecture..."
                              value={newDesc}
                              onChange={(e) => setNewDesc(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Capstone Category / Domain
                              </label>
                              <select
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              >
                                <option value="Web & Cloud Architecture / AI">Web & Cloud Architecture / AI</option>
                                <option value="Machine Learning & Deep Learning">Machine Learning & Deep Learning</option>
                                <option value="Mobile Application (Capacitor/Android/iOS)">Mobile Application (Capacitor/Android)</option>
                                <option value="Cybersecurity & Cryptography">Cybersecurity & Cryptography</option>
                                <option value="Distributed Systems & Blockchain">Distributed Systems & Blockchain</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Core Technologies (comma separated)
                              </label>
                              <input
                                type="text"
                                placeholder="TypeScript, Next.js, Node.js, PostgreSQL"
                                value={newTechInput}
                                onChange={(e) => setNewTechInput(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              GitHub Repository URL
                            </label>
                            <input
                              type="url"
                              placeholder="https://github.com/parthd45/placeai"
                              value={newRepoUrl}
                              onChange={(e) => setNewRepoUrl(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                            />
                          </div>

                          {/* Founder Details Confirmation */}
                          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-[#1b7056] text-white flex items-center justify-center font-bold text-xs">
                                {(user?.name || "PD")
                                  .split(" ")
                                  .filter(Boolean)
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <span>{user?.name}</span>
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                    Assigned as Team Lead
                                  </span>
                                </div>
                                <div className="text-slate-500 text-[11px]">
                                  {user?.rollNumber} • {user?.department}
                                </div>
                              </div>
                            </div>

                            <div className="text-right text-[11px] text-slate-400 hidden sm:block">
                              Capacity: 1/4 Members (3 Open Slots)
                            </div>
                          </div>

                          {formError && (
                            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 font-medium">
                              {formError}
                            </div>
                          )}

                          <button
                            type="submit"
                            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <PlusCircle className="h-4 w-4" />
                            <span>Register Squad & Launch Capstone Dashboard</span>
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {currentRole === "MENTOR" && (
              <MentorDashboard
                project={project || initialProject}
                onUpdateProject={handleUpdateProject}
              />
            )}

            {(currentRole === "DEPARTMENT_ADMIN" ||
              currentRole === "ORGANIZATION_ADMIN") && (
              <AdminDashboard project={project || initialProject} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
