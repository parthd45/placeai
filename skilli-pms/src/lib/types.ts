export type UserRole =
  | "STUDENT"
  | "MENTOR"
  | "FACULTY"
  | "ORGANIZATION_ADMIN"
  | "DEPARTMENT_ADMIN"
  | "REVIEWER";

export type ProjectType =
  | "CAPSTONE"
  | "RESEARCH"
  | "INDUSTRY"
  | "ACADEMIC"
  | "THESIS"
  | "OPEN_SOURCE";

export type TaskStatus =
  | "BACKLOG"
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE";

export type TaskPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";

export type MilestoneStatus =
  | "COMPLETED"
  | "IN_REVIEW"
  | "IN_PROGRESS"
  | "PENDING";

export interface TeamMember {
  id: string;
  name: string;
  role: "Team Lead" | "Full-Stack Dev" | "ML Engineer" | "UI/UX Designer";
  rollNumber: string;
  email: string;
  avatar: string;
}

export interface Mentor {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: TeamMember;
  dueDate: string;
  labels: string[];
}

export interface Milestone {
  id: string;
  name: string;
  phase: string;
  description: string;
  startDate: string;
  dueDate: string;
  status: MilestoneStatus;
  score?: {
    obtained: number;
    max: number;
  };
  feedback?: string;
  submissionFiles?: {
    name: string;
    size: string;
    url: string;
    uploadedAt: string;
  }[];
}

export interface RubricCriterion {
  id: string;
  title: string;
  description: string;
  maxScore: number;
  assignedScore: number;
  weightage: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  department: string;
  academicYear: string;
  division: string;
  progressPercentage: number;
  status: "Active" | "Under Review" | "Completed" | "Pending Approval";
  technologies: string[];
  objectives: string[];
  repositoryUrl: string;
  figmaUrl: string;
  miroUrl: string;
  teamMembers: TeamMember[];
  mentors: Mentor[];
  milestones: Milestone[];
  tasks: Task[];
  rubricCriteria: RubricCriterion[];
}
