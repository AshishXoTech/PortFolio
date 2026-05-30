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
    line(ASHISH_ASCII, "green", true),
    line("", "default"),
    line("Role:", "muted"),
    line("Full Stack Developer", "default"),
    line("", "default"),
    line("Stack:", "muted"),
    line("MERN | Next.js | TypeScript | Docker | FastAPI", "purple"),
    line("", "default"),
    line("Status:", "muted"),
    line("Available for opportunities", "green"),
    line("", "default"),
    line("Location:", "muted"),
    line("Jaipur, Rajasthan, India", "default"),
  ];
}

export function getNeofetchLines(): TerminalLine[] {
  const logoLines = NEOFETCH_LOGO.split("\n");
  const infoLines = [
    "ashish@portfolio",
    "----------------------------",
    "OS: AshishOS 1.0.0",
    "Host: University of Engineering & Management",
    "Kernel: Next.js 14.0 LTS",
    "Uptime: Since August 2024",
    "Packages: 47 npm packages",
    "Shell: bash 5.2 (portfolio edition)",
    "Terminal: AshishOS Terminal",
    "CPU: Brain @ 3.6GHz (coffee-cooled)",
    "Memory: 8.0 GPA / 10.0 Total",
    "Hacks: 3x Winner / 2x National / 1x International",
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
    line("🏆 [GOLD] 3x Internal Hackathon Winner — 100+ teams", "gold", true),
    line(
      "🥈 [SILVER] 2x National Hackathon Finalist",
      "silver",
      true
    ),
    line(
      "🥉 [BRONZE] 1x International Hackathon Finalist",
      "bronze",
      true
    ),
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

export function getSudoHireLines(): TerminalLine[] {
  return [
    line("███████████████████████ 80%...100%", "green", true),
    line("", "default"),
    line("ACCESS GRANTED", "success"),
    line("", "default"),
    line("Authorization:", "muted"),
    line("SENIOR_ENGINEER_LEVEL", "green"),
    line("", "default"),
    line("Welcome to the team.", "default"),
    line("You made a great decision.", "default"),
    line("", "default"),
    line("(Contact: ashish863863@gmail.com)", "muted"),
  ];
}

export function getRmRfLines(): TerminalLine[] {
  return lines(
    [
      "Removing files... src/... components/... app/...",
      "Removing node_modules (this may take a while)...",
      "...",
      "Just kidding.",
      "You cannot delete greatness.",
      "AshishOS remains fully operational.",
    ],
    "default"
  );
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
  if (base === "sudo" && trimmed === "sudo h") return "sudo hire ashish";
  if (base === "rm" && trimmed.startsWith("rm -")) return "rm -rf portfolio";

  return null;
}
