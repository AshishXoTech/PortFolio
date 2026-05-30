import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "hackflow-ai",
    title: "HackFlow AI",
    tagline: "AI-powered developer evaluation platform",
    description:
      "HackFlow AI is a developer evaluation platform that automatically analyzes GitHub repositories and generates project insights using an AI-powered assessment pipeline. The system combines Next.js, FastAPI, PostgreSQL, JWT authentication, and microservice architecture to process repositories and generate rankings. Real-time leaderboards and automated scoring reduce manual project review effort while providing transparent evaluation metrics.",
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
      "Rakshak is a fraud analysis platform built around a three-tier role-based access model with secure authentication and authorization controls. The platform uses OpenAI-powered risk evaluation to generate fraud scores between 0 and 100 while Redis caching improves response times for repeated analysis requests. Dockerized deployment ensures consistent environments across development and production.",
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
      "AI Credit Risk Advisor evaluates financial profiles using debt-to-income ratios, cash-flow patterns, and credit risk indicators. The system generates explainable recommendations instead of returning black-box scores, helping users understand the factors affecting risk assessments. Interactive visualizations provide a clear breakdown of financial metrics and decision reasoning.",
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
