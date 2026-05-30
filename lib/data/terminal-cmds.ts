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
      "→ HackFlow AI — Next.js, Node, PostgreSQL, Prisma, FastAPI, JWT",
      "→ Rakshak Fraud Platform — Node, MongoDB, JWT, RBAC, OpenAI, Docker, Redis",
      "→ AI Credit Risk Advisor — React, Node, OpenAI API, Tailwind, Recharts",
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
      "🏆 3× Internal Hackathon Winner",
      "🥈 2× National Finalist",
      "🌍 1× International Finalist",
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
    output: "ashish@ashishos",
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
      "OS:       AshishOS v1.0",
      "Host:     ashish-portfolio.vercel.app",
      "Kernel:   Next.js 14 + TypeScript",
      "Uptime:   Always online",
      "Shell:    ashish-terminal",
      "Stack:    MERN, FastAPI, PostgreSQL, Docker",
    ],
  },
};

export const TERMINAL_WELCOME = [
  "Welcome to AshishOS Terminal v1.0",
  "Type 'help' for available commands.",
  "",
];
