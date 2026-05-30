import { projects } from "@/lib/data/projects";
import type { AppId } from "@/types/os";
import type { TerminalLine } from "@/lib/terminal/types";

export const TERMINAL_COMMANDS = [
  "help",
  "whoami",
  "neofetch",
  "skills",
  "projects",
  "education",
  "achievements",
  "contact",
  "open",
  "cat",
  "sudo",
  "rm",
  "clear",
] as const;

export const OPENABLE_APPS: AppId[] = [
  "about",
  "projects",
  "skills",
  "achievements",
  "blog",
  "contact",
];

const ASHISH_ASCII = ` █████  ███████ ██████  ██ ███████ ██   ██
██   ██ ██      ██   ██ ██ ██      ██   ██
███████ █████   ██████  ██ █████   ███████
██   ██ ██      ██   ██ ██ ██      ██   ██
██   ██ ███████ ██   ██ ██ ███████ ██   ██`;

const NEOFETCH_LOGO = `    █████╗
   ██╔══██╗
   ███████║
   ██╔══██║
   ██║  ██║
   ╚═╝  ╚═╝`;

function line(
  content: string,
  tone: TerminalLine["tone"] = "default",
  animate = false
): TerminalLine {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    tone,
    content,
    animate,
  };
}

function lines(
  contents: string[],
  tone: TerminalLine["tone"] = "default",
  animate = false
): TerminalLine[] {
  return contents.map((content) => line(content, tone, animate));
}

export function getHelpLines(): TerminalLine[] {
  const commands: [string, string][] = [
    ["help", "Show all available commands"],
    ["whoami", "Display profile and ASCII banner"],
    ["neofetch", "System information panel"],
    ["skills", "List tech stack by category"],
    ["projects", "Show portfolio projects"],
    ["education", "University and degree info"],
    ["achievements", "Hackathon wins and finals"],
    ["contact", "Email and social links"],
    ["open <app>", "Open app window (about, projects, skills, ...)"],
    ["cat resume.pdf", "Download resume PDF"],
    ["sudo hire ashish", "Special command — try it"],
    ["rm -rf portfolio", "Delete everything (just kidding)"],
    ["clear", "Clear terminal screen"],
  ];

  const result: TerminalLine[] = [
    line("Available commands:", "muted"),
    line("", "default"),
  ];

  commands.forEach(([cmd, desc]) => {
    result.push(line(cmd.padEnd(22), "green"));
    result.push(line(desc, "muted"));
  });

  return result;
}

export function getWhoamiLines(): TerminalLine[] {
  return [
    line("Ashish Kumar Jha", "green", true),
    line("", "default"),
    line("Full Stack Developer", "default"),
    line("B.Tech CSE @ UEM Jaipur", "muted"),
    line("", "default"),
    line("Building:", "muted"),
    line("  Web platforms", "default"),
    line("  AI-powered tools", "default"),
    line("  Backend systems", "default"),
    line("", "default"),
    line("Current objective:", "muted"),
    line("Software Engineer", "green"),
  ];
}

export function getNeofetchLines(): TerminalLine[] {
  const logoLines = NEOFETCH_LOGO.split("\n");
  const infoLines = [
    "AshishOS 1.0",
    "----------------------------",
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
  ];

  const maxRows = Math.max(logoLines.length, infoLines.length);
  const combined: TerminalLine[] = [];

  for (let i = 0; i < maxRows; i += 1) {
    const left = (logoLines[i] ?? "").padEnd(14);
    const right = infoLines[i] ?? "";
    combined.push(line(`${left}${right}`, i === 0 ? "green" : "default", i === 0));
  }

  return combined;
}

export function getSkillsLines(): TerminalLine[] {
  const groups: [string, string[]][] = [
    [
      "FRONTEND",
      ["React.js", "Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    ],
    ["BACKEND", ["Node.js", "Express", "FastAPI", "JWT Auth", "RBAC"]],
    ["DATABASE", ["MongoDB", "PostgreSQL", "Redis", "Prisma ORM"]],
    ["DEVOPS", ["Docker", "Git/GitHub", "Postman"]],
    ["AI/ML", ["OpenAI API", "LLM Integration"]],
    ["LEARNING", ["Java", "DSA", "System Design"]],
  ];

  const result: TerminalLine[] = [];

  groups.forEach(([heading, items]) => {
    result.push(line(heading, "green"));
    items.forEach((item) => result.push(line(`  ${item}`, "default")));
    result.push(line("", "default"));
  });

  return result;
}

export function getProjectsLines(): TerminalLine[] {
  const result: TerminalLine[] = [];

  projects.forEach((project, index) => {
    const num = String(index + 1).padStart(2, "0");
    result.push(line(`[${num}] ${project.title}`, "green"));
    result.push(line("Stack:", "muted"));
    result.push(line(project.stack.join(", "), "default"));
    result.push(line(project.tagline, "default"));
    if (project.github) {
      result.push(line("GitHub:", "muted"));
      result.push(line(project.github, "purple"));
    }
    result.push(line("", "default"));
  });

  return result;
}

export function getEducationLines(): TerminalLine[] {
  return [
    line("University:", "muted"),
    line("University of Engineering & Management, Jaipur", "default"),
    line("", "default"),
    line("Degree:", "muted"),
    line("B.Tech Computer Science & Engineering", "default"),
    line("", "default"),
    line("Year:", "muted"),
    line("2024 – 2028", "default"),
    line("", "default"),
    line("CGPA:", "muted"),
    line("8.0 / 10.0", "green"),
  ];
}

export function getAchievementsLines(): TerminalLine[] {
  return [
    line("[✓] 3x Internal Hackathon Winner", "gold", true),
    line("[✓] 2x National Hackathon Finalist", "silver", true),
    line("[✓] 1x International Hackathon Finalist", "bronze", true),
  ];
}

export function getContactLines(): TerminalLine[] {
  return lines([
    "Email:",
    "ashish863863@gmail.com",
    "",
    "GitHub:",
    "https://github.com/AshishXoTech",
    "",
    "LinkedIn:",
    "www.linkedin.com/in/ashish-kumar-jha-43887726b",
  ]).map((entry, index) => {
    if (entry.content.endsWith(":")) return { ...entry, tone: "muted" };
    if (entry.content.startsWith("http") || entry.content.startsWith("www"))
      return { ...entry, tone: "purple" };
    if (entry.content.includes("@"))
      return { ...entry, tone: "green" };
    return entry;
  });
}

export function getOpenLines(
  appName: string,
  openApp: (appId: AppId) => void
): TerminalLine[] {
  const normalized = appName.toLowerCase().trim();

  if (!normalized) {
    return [
      line("Usage: open <appname>", "error"),
      line("Try: open about", "muted"),
    ];
  }

  if (!OPENABLE_APPS.includes(normalized as AppId)) {
    return [line("Error: app not found. Try: open about", "error")];
  }

  openApp(normalized as AppId);
  return [line(`Opening ${normalized}.app...`, "green")];
}

export function getCatResumeLines(): TerminalLine[] {
  return [
    line("Fetching resume... done.", "default"),
    line("Initiating download...", "default"),
  ];
}

export function getCatSecretLines(): TerminalLine[] {
  return [
    line("There is no shortcut.", "green", true),
    line("", "default"),
    line("Every project here exists because of repeated failure,", "default"),
    line("debugging at 2 AM,", "default"),
    line("and rebuilding things that did not work the first time.", "default"),
  ];
}

export function getSudoHireLines(): TerminalLine[] {
  return [
    line("Access granted.", "success", true),
    line("", "default"),
    line("Candidate Summary:", "muted"),
    line("  - Ships projects", "default"),
    line("  - Understands full-stack architecture", "default"),
    line("  - Comfortable with modern web technologies", "default"),
    line("  - Actively improving DSA and system design", "default"),
    line("", "default"),
    line("Recommendation:", "muted"),
    line("Proceed to technical interview.", "green"),
  ];
}

export function getRmRfLines(): TerminalLine[] {
  return [
    line("Error:", "error"),
    line("Permission denied.", "error"),
    line("", "default"),
    line("Reason:", "muted"),
    line("Portfolio is currently mounted to production.", "default"),
    line("", "default"),
    line("Suggested action:", "muted"),
    line("Explore projects instead.", "green"),
  ];
}

export function getUnknownCommandLines(command: string): TerminalLine[] {
  return [
    line(`bash: ${command}: command not found`, "error"),
    line("Type 'help' for available commands.", "muted"),
  ];
}

export function autocompleteCommand(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(/\s+/);
  const base = parts[0].toLowerCase();

  if (parts.length === 1) {
    const matches = TERMINAL_COMMANDS.filter((cmd) => cmd.startsWith(base));
    if (matches.length === 1) return matches[0];
    if (matches.length > 1) {
      let common: string = matches[0];
      matches.slice(1).forEach((cmd) => {
        let i = 0;
        while (
          i < common.length &&
          i < cmd.length &&
          common[i] === cmd[i]
        ) {
          i += 1;
        }
        common = common.slice(0, i);
      });
      return common.length > base.length ? common : matches[0];
    }
  }

  if (base === "open" && parts.length === 2) {
    const appPart = parts[1].toLowerCase();
    const match = OPENABLE_APPS.find((app) => app.startsWith(appPart));
    return match ? `open ${match}` : null;
  }

  if (base === "cat" && trimmed === "cat r") return "cat resume.pdf";
  if (base === "cat" && trimmed === "cat s") return "cat secret.txt";
  if (base === "sudo" && trimmed === "sudo h") return "sudo hire ashish";
  if (base === "rm" && trimmed.startsWith("rm -")) return "rm -rf portfolio";

  return null;
}
