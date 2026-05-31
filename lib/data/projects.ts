import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "hackflow-ai",
    title: "HackFlow AI",
    tagline: "AI-powered developer evaluation platform",
    description:
      "A Python FastAPI ML pipeline evaluates GitHub repositories with NLP while a Node.js REST API handles product workflows. Organizers, judges, and participants use role-based access with JWT authentication and PostgreSQL-backed data. Real-time leaderboards turn manual hackathon judging into a faster, more transparent evaluation system.",
    stack: [
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "FastAPI",
      "Prisma",
      "JWT",
    ],
    github: "https://github.com/AshishXoTech",
    featured: true,
  },
  {
    id: "rakshak-fraud-platform",
    title: "Rakshak Fraud Platform",
    tagline: "Fraud analysis with AI-powered risk scoring",
    description:
      "OpenAI scores every complaint from 0-100 and returns plain-English fraud reasoning for analysts. The platform uses 3-tier RBAC across user, analyst, and admin roles with JWT-secured Express APIs. Redis caching and Dockerized services keep repeated analysis fast and deployment predictable.",
    stack: [
      "Node.js",
      "MongoDB",
      "JWT",
      "RBAC",
      "OpenAI",
      "Redis",
      "Docker",
    ],
    github: "https://github.com/AshishXoTech",
    featured: true,
  },
  {
    id: "ai-credit-risk-advisor",
    title: "AI Credit Risk Advisor",
    tagline: "Explainable AI for financial risk assessment",
    description:
      "Cashflow and debt-to-income metrics drive a credit-risk engine instead of vague black-box scoring. OpenAI converts the financial signals into explainable recommendations a user can actually understand. Recharts dashboards show risk trends over time so decisions are visible, not hidden in a number.",
    stack: [
      "React",
      "Node.js",
      "OpenAI API",
      "Recharts",
    ],
    github: "https://github.com/AshishXoTech",
    featured: true,
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}
