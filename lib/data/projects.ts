import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "hackflow-ai",
    title: "HackFlow AI",
    tagline: "AI-powered hackathon management platform",
    description:
      "Full-stack role-based platform for organizers and judges. AI evaluates GitHub repos automatically using NLP. Microservices: Node REST + Python FastAPI ML pipeline.",
    stack: [
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Prisma",
      "FastAPI",
      "JWT",
    ],
    github: "https://github.com/AshishXoTech",
    featured: true,
  },
  {
    id: "rakshak-fraud-platform",
    title: "Rakshak",
    tagline: "Enterprise fraud detection with AI scoring",
    description:
      "REST API backend with 3-tier RBAC (user/analyst/admin). OpenAI scores fraud complaints 0–100 with explanations. Dockerized deployment with Redis caching layer.",
    stack: [
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "RBAC",
      "OpenAI",
      "Docker",
      "Redis",
    ],
    github: "https://github.com/AshishXoTech",
    featured: true,
  },
  {
    id: "ai-credit-risk-advisor",
    title: "AI Credit Advisor",
    tagline: "Explainable AI for credit risk assessment",
    description:
      "Credit risk scoring system (0–100) using cashflow metrics. OpenAI provides plain-English financial advisory recommendations. Interactive charts visualize debt-to-income ratios over time.",
    stack: [
      "React.js",
      "Node.js",
      "Express",
      "OpenAI API",
      "Recharts",
      "Tailwind",
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
