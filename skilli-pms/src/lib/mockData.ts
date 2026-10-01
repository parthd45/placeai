import { ProjectData, Milestone, RubricCriterion, Mentor, StudentUser } from "./types";

export const defaultMentors: Mentor[] = [
  {
    id: "men-1",
    name: "Dr. Shrikant Joshi",
    designation: "Head of Department & Capstone Guide",
    department: "Department of Computer Applications (MCA)",
    email: "shrikant.joshi@mesimcc.edu.in",
    avatar: "https://ui-avatars.com/api/?name=Dr+Shrikant+Joshi&background=0f172a&color=fff",
  },
  {
    id: "men-2",
    name: "Prof. Minakshi More",
    designation: "Associate Professor & Technical Reviewer",
    department: "Department of Computer Applications (MCA)",
    email: "minakshi.more@mesimcc.edu.in",
    avatar: "https://ui-avatars.com/api/?name=Prof+Minakshi+More&background=0f172a&color=fff",
  },
];

export function createDefaultMilestones(): Milestone[] {
  return [
    {
      id: "m-1",
      name: "Problem Definition & Synopsis Defense",
      phase: "Phase 1: Inception",
      description:
        "Submission of abstract, architectural feasibility study, comparative literature analysis, and tech stack approval from IMCC department committee.",
      startDate: "2026-08-01",
      dueDate: "2026-08-25",
      status: "PENDING",
      submissionFiles: [],
    },
    {
      id: "m-2",
      name: "SRS Specification, Database Schemas & Architecture Design",
      phase: "Phase 2: Architectural Design",
      description:
        "Comprehensive ER diagrams, relational PostgreSQL schemas, API contracts, and security architecture specifications.",
      startDate: "2026-08-26",
      dueDate: "2026-09-15",
      status: "PENDING",
      submissionFiles: [],
    },
    {
      id: "m-3",
      name: "Core Engine Implementation & Working Prototype",
      phase: "Phase 3: Core Implementation",
      description:
        "Full-stack microservices, business logic, asynchronous pipelines, and functional frontend client prototype.",
      startDate: "2026-09-16",
      dueDate: "2026-10-05",
      status: "PENDING",
      submissionFiles: [],
    },
    {
      id: "m-4",
      name: "Validation, Automated Testing & Security Audit",
      phase: "Phase 4: Testing & Security",
      description:
        "End-to-end integration tests, load testing, security vulnerability audit, and cross-platform mobile verification.",
      startDate: "2026-10-06",
      dueDate: "2026-10-28",
      status: "PENDING",
      submissionFiles: [],
    },
    {
      id: "m-5",
      name: "Production Deployment, Thesis Defense & University Viva Voce",
      phase: "Phase 5: External Examination",
      description:
        "Live production defense before the university external committee and industry technical adjudicators with final bound thesis.",
      startDate: "2026-10-29",
      dueDate: "2026-11-20",
      status: "PENDING",
      submissionFiles: [],
    },
  ];
}

export function createDefaultRubricCriteria(): RubricCriterion[] {
  return [
    {
      id: "c-1",
      title: "Problem Understanding & Literature Synthesis",
      description: "Depth of domain research, clarity of objectives, and relevance to industry requirements.",
      maxScore: 20,
      assignedScore: 0,
      weightage: "20%",
    },
    {
      id: "c-2",
      title: "Architecture, Data Modeling & System Design",
      description: "Robustness of relational schemas, API contracts, security authentication, and scalability.",
      maxScore: 25,
      assignedScore: 0,
      weightage: "25%",
    },
    {
      id: "c-3",
      title: "Implementation Depth & Code Quality",
      description: "Code modularity, idiomatic standards, Git hygiene on GitHub, and asynchronous paradigms.",
      maxScore: 30,
      assignedScore: 0,
      weightage: "30%",
    },
    {
      id: "c-4",
      title: "Validation, Testing & Deployment",
      description: "Automated unit test coverage, APK compilation, security headers, and production deployment.",
      maxScore: 15,
      assignedScore: 0,
      weightage: "15%",
    },
    {
      id: "c-5",
      title: "Viva Defense, Presentation & Documentation",
      description: "Technical Q&A defense before committee, clarity of explanation, and formal documentation.",
      maxScore: 10,
      assignedScore: 0,
      weightage: "10%",
    },
  ];
}

/**
 * Creates a 100% REAL Capstone Squad with ZERO mock data.
 * Contains only the creating student and open slots for real teammates.
 */
export function createNewCapstoneSquad(
  creator: StudentUser,
  details: {
    name: string;
    description: string;
    technologies: string[];
    repositoryUrl?: string;
    figmaUrl?: string;
    miroUrl?: string;
    role?: string;
    inviteCode?: string;
  }
): ProjectData {
  const code =
    details.inviteCode ||
    `IMCC-CAP-${Math.floor(1000 + Math.random() * 9000)}`;

  const squadId = `squad-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return {
    id: squadId,
    name: details.name,
    description: details.description,
    type: "CAPSTONE",
    department: creator.department || "Department of Computer Applications (MCA)",
    academicYear: "SY MCA (2024-2026)",
    division: creator.division || "Division A",
    progressPercentage: 0,
    status: "Active",
    technologies: details.technologies.length > 0 ? details.technologies : ["TypeScript", "Next.js", "Node.js", "PostgreSQL"],
    objectives: [
      "Implement verified full-stack architecture with production telemetry",
      "Deploy persistent cloud database schemas with role-based security",
      "Integrate automated CI/CD continuous deployment pipeline",
      "Successfully defend project viva before MES IMCC Capstone Committee",
    ],
    repositoryUrl: details.repositoryUrl || creator.githubUrl || "",
    figmaUrl: details.figmaUrl || "",
    miroUrl: details.miroUrl || "",
    inviteCode: code,
    maxTeamSize: 4,
    teamMembers: [
      {
        id: creator.id,
        name: creator.name,
        role: (details.role as any) || "Team Lead",
        rollNumber: creator.rollNumber,
        email: creator.email,
        avatar: creator.avatar,
        skills: creator.skills || [],
        joinedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      },
    ],
    mentors: defaultMentors,
    milestones: createDefaultMilestones(),
    tasks: [], // ZERO fake tasks. Pure real sprint tasks created by the team.
    rubricCriteria: createDefaultRubricCriteria(),
  };
}

/**
 * Empty baseline project - no fake members, 0 tasks.
 */
export const initialProject: ProjectData = {
  id: "proj-unassigned",
  name: "Capstone Project",
  description: "No project synopsis submitted yet.",
  type: "CAPSTONE",
  department: "Department of Computer Applications (MCA)",
  academicYear: "SY MCA (2024-2026)",
  division: "Division A",
  progressPercentage: 0,
  status: "Pending Approval",
  technologies: [],
  objectives: [],
  repositoryUrl: "",
  figmaUrl: "",
  miroUrl: "",
  inviteCode: "IMCC-CAP-0000",
  maxTeamSize: 4,
  teamMembers: [], // ZERO fake members
  mentors: defaultMentors,
  milestones: createDefaultMilestones(),
  tasks: [], // ZERO fake tasks
  rubricCriteria: createDefaultRubricCriteria(),
};

export const sampleDepartmentTeams = [
  {
    id: "proj-imcc-placeai",
    name: "PlaceAI - Placement Intelligence & Technical Assessment Platform",
    batch: "SY MCA - Div A",
    lead: "Parth Deshmukh (2401089)",
    mentor: "Dr. Shrikant Joshi",
    progress: 85,
    status: "Active",
    lastSubmission: "Working Prototype & Proctored Compiler Engine",
    pendingAction: "Mentor Review Required",
    inviteCode: "IMCC-CAP-7942",
  },
];
