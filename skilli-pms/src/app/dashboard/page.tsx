"use client";

import React, { useState } from "react";
import { UserRole, ProjectData } from "@/lib/types";
import { initialProject } from "@/lib/mockData";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { StudentDashboard } from "@/components/StudentDashboard";
import { MentorDashboard } from "@/components/MentorDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";

export default function DashboardPage() {
  const [currentRole, setCurrentRole] = useState<UserRole>("STUDENT");
  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState<ProjectData>(initialProject);

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
    <div className="min-h-screen flex flex-col bg-[hsl(var(--background))] text-[hsl(var(--foreground))] transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeView={activeTab}
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
            {/* View Switching based on Active Role */}
            {currentRole === "STUDENT" && (
              <StudentDashboard
                project={project}
                onUpdateProject={setProject}
              />
            )}

            {currentRole === "MENTOR" && (
              <MentorDashboard
                project={project}
                onUpdateProject={setProject}
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
