import type { TerminalCommand } from "@/types";

export const terminalCommands: Record<string, TerminalCommand> = {
  help: {
    command: "help",
    output: [
      "Available commands:",
      "  about       — Show profile info",
      "  projects    — List featured projects",
      "  skills      — Display tech stack",
      "  achievements — Show hackathon wins",
      "  contact     — Display contact info",
      "  clear       — Clear terminal",
      "  whoami      — Current user",
      "  neofetch    — System info banner",
    ],
  },
  about: {
    command: "about",
    output: [
      "Ashish Kumar Jha",
      "Full Stack Developer | B.Tech CSE @ UEM Jaipur (2024-2028)",
      "CGPA: 8.0/10",
      "Goal: Software Engineer — learning DSA + Java",
    ],
  },
  projects: {
    command: "projects",
    output: [
      "→ HackFlow AI — Next.js, Node.js, PostgreSQL, FastAPI, Prisma, JWT",
      "→ Rakshak Fraud Platform — Node.js, MongoDB, JWT, RBAC, OpenAI, Redis, Docker",
      "→ AI Credit Risk Advisor — React, Node.js, OpenAI API, Recharts",
    ],
  },
  skills: {
    command: "skills",
    output: [
      "Frontend:  React, Next.js, TypeScript, Tailwind CSS",
      "Backend:   Node.js, Express.js, FastAPI, REST APIs",
      "Database:  PostgreSQL, MongoDB, Prisma, Redis",
      "DevOps:    Docker, Git, GitHub Actions, Vercel",
      "Learning:  DSA, Java, System Design",
    ],
  },
  achievements: {
    command: "achievements",
    output: [
      "[✓] 3x Internal Hackathon Winner",
      "[✓] 2x National Hackathon Finalist",
      "[✓] 1x International Hackathon Finalist",
    ],
  },
  contact: {
    command: "contact",
    output: [
      "Email:  ashish863863@gmail.com",
      "GitHub: https://github.com/AshishXoTech",
    ],
  },
  whoami: {
    command: "whoami",
    output: [
      "Ashish Kumar Jha",
      "",
      "Full Stack Developer",
      "B.Tech CSE @ UEM Jaipur",
      "",
      "Building:",
      "  Web platforms",
      "  AI-powered tools",
      "  Backend systems",
      "",
      "Current objective:",
      "Software Engineer",
    ],
  },
  neofetch: {
    command: "neofetch",
    output: [
      "       █████╗ ███████╗██╗  ██╗██╗███████╗██╗  ██╗",
      "      ██╔══██╗██╔════╝██║  ██║██║██╔════╝██║  ██║",
      "      ███████║███████╗███████║██║███████╗███████║",
      "      ██╔══██║╚════██║██╔══██║██║╚════██║██╔══██║",
      "      ██║  ██║███████║██║  ██║██║███████║██║  ██║",
      "      ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝",
      "",
      "AshishOS 1.0",
      "",
      "User: ashish",
      "Role: Full Stack Developer",
      "University: UEM Jaipur",
      "CGPA: 8.0/10",
      "",
      "Stack:",
      "Next.js, TypeScript, Node.js",
      "FastAPI, PostgreSQL, MongoDB",
      "Docker, Redis",
      "",
      "Achievements:",
      "3x Internal Hackathon Winner",
      "2x National Finalist",
      "1x International Finalist",
      "",
      "Status: Learning Java + DSA",
    ],
  },
};

export const TERMINAL_WELCOME = [
  "Welcome to AshishOS Terminal v1.0",
  "Type 'help' for available commands.",
  "",
];
