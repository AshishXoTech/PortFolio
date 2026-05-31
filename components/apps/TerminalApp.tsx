"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useOS } from "@/hooks/useOS";
import type { AppId } from "@/types/os";

const PROMPT = "[ashish@portfolio ~]$ ";
const OUTPUT_TYPEWRITER_MS = 8;
const WELCOME_TYPEWRITER_MS = 25;
const MAX_HISTORY = 100;
const MAX_TERMINAL_LINES = 220;
const SCROLL_THROTTLE_MS = 80;
const QUICK_COMMANDS = ["help", "whoami", "projects", "neofetch", "sudo hire ashish"];

interface TerminalAppProps {
  showcase?: boolean;
}

type Tone = "prompt" | "default" | "error" | "success" | "muted";

interface LineSegment {
  text: string;
  tone: Tone;
}

interface TerminalLine {
  id: string;
  segments: LineSegment[];
  speed: number;
}

interface CommandDefinition {
  command: string;
  description: string;
}

interface SkillGroup {
  category: string;
  skills: Array<{ name: string; value: number }>;
}

const OPENABLE_APPS: AppId[] = [
  "about",
  "projects",
  "skills",
  "achievements",
  "blog",
  "contact",
];

const COMMANDS: CommandDefinition[] = [
  { command: "help", description: "Show available commands" },
  { command: "whoami", description: "Print Ashish's profile" },
  { command: "skills", description: "Show stack grouped by category" },
  { command: "projects", description: "List featured engineering projects" },
  { command: "education", description: "Show college and degree info" },
  { command: "achievements", description: "Show hackathon wins and finals" },
  { command: "contact", description: "Print email and social links" },
  { command: "neofetch", description: "Display AshishOS system info" },
  { command: "git log", description: "Show recent commit history" },
  { command: "open", description: "Open an app window" },
  { command: "cat resume.pdf", description: "Open the resume PDF" },
  { command: "sudo hire ashish", description: "Run the best command" },
  { command: "rm -rf portfolio", description: "Try to delete the portfolio" },
  { command: "clear", description: "Clear terminal output" },
];

const AUTOCOMPLETE_COMMANDS = COMMANDS.map((item) => item.command);

const SKILL_GROUPS: SkillGroup[] = [
  {
    category: "FRONTEND",
    skills: [
      { name: "React.js", value: 90 },
      { name: "Next.js", value: 88 },
      { name: "TypeScript", value: 82 },
      { name: "Tailwind CSS", value: 85 },
      { name: "Framer Motion", value: 72 },
      { name: "HTML CSS", value: 92 },
    ],
  },
  {
    category: "BACKEND",
    skills: [
      { name: "Node.js", value: 88 },
      { name: "Express.js", value: 86 },
      { name: "FastAPI", value: 70 },
      { name: "REST APIs", value: 90 },
      { name: "JWT Auth", value: 85 },
      { name: "RBAC", value: 80 },
    ],
  },
  {
    category: "DATABASE",
    skills: [
      { name: "MongoDB", value: 84 },
      { name: "PostgreSQL", value: 80 },
      { name: "Redis", value: 72 },
      { name: "Prisma ORM", value: 78 },
      { name: "Mongoose", value: 82 },
    ],
  },
  {
    category: "DEVOPS",
    skills: [
      { name: "Docker", value: 78 },
      { name: "Git GitHub", value: 92 },
      { name: "Postman", value: 85 },
    ],
  },
  {
    category: "AI",
    skills: [
      { name: "OpenAI API", value: 80 },
      { name: "LLM Integration", value: 72 },
    ],
  },
  {
    category: "LEARNING",
    skills: [
      { name: "Java", value: 45 },
      { name: "DSA", value: 50 },
      { name: "System Design", value: 40 },
    ],
  },
];

const TONE_CLASSES: Record<Tone, string> = {
  prompt: "text-[#00ff41]",
  default: "text-[#c8c8c8]",
  error: "text-[#ff5f57]",
  success: "text-[#00ff41]",
  muted: "text-[#6a6a8a]",
};

function createLine(
  content: string,
  tone: Tone = "default",
  speed = OUTPUT_TYPEWRITER_MS
): TerminalLine {
  return createSegmentLine([{ text: content, tone }], speed);
}

function createSegmentLine(
  segments: LineSegment[],
  speed = OUTPUT_TYPEWRITER_MS
): TerminalLine {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    segments,
    speed,
  };
}

function getLineText(line: TerminalLine): string {
  return line.segments.map((segment) => segment.text).join("");
}

function getWelcomeLines(): TerminalLine[] {
  return [
    createLine("AshishOS Terminal v1.0.0", "default", WELCOME_TYPEWRITER_MS),
    createLine(
      "Kernel: Next.js 14 | Shell: bash 5.2 | Build #247",
      "default",
      WELCOME_TYPEWRITER_MS
    ),
    createLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "muted", WELCOME_TYPEWRITER_MS),
    createLine("Welcome. You are now inside Ashish's portfolio OS.", "success", WELCOME_TYPEWRITER_MS),
    createLine("Type 'help' to see available commands.", "default", WELCOME_TYPEWRITER_MS),
    createLine("", "default", WELCOME_TYPEWRITER_MS),
  ];
}

function pad(value: string, length: number): string {
  return value.padEnd(length, " ");
}

function getProgressBar(percent: number): string {
  const filled = Math.round(percent / 10);
  return `${"█".repeat(filled)}${"░".repeat(10 - filled)}`;
}

function getHelpLines(): TerminalLine[] {
  return COMMANDS.map((item) =>
    createSegmentLine([
      { text: pad(item.command, 20), tone: "success" },
      { text: item.description, tone: "muted" },
    ])
  );
}

function getWhoamiLines(): TerminalLine[] {
  return [
    "Name:    Ashish Kumar Jha",
    "Role:    Full Stack Developer",
    "College: University of Engineering & Management, Jaipur",
    "Degree:  B.Tech CSE, 2024-2028",
    "CGPA:    8.0 / 10.0",
    "",
    "Stack:   MERN, Next.js 14, TypeScript, Docker, FastAPI",
    "         PostgreSQL, Redis, OpenAI API, Prisma ORM, JWT",
    "",
    "Wins:    3x Internal Hackathon Winner",
    "         2x National Hackathon Finalist",
    "         1x International Hackathon Finalist",
    "",
    "Now:     Learning Java, DSA, and System Design for SWE roles",
    "Status:  Open to opportunities",
  ].map((line) => createLine(line));
}

function getSkillsLines(): TerminalLine[] {
  const lines: TerminalLine[] = [];

  SKILL_GROUPS.forEach((group) => {
    lines.push(createLine(group.category, "success"));

    group.skills.forEach((skill) => {
      lines.push(
        createLine(
          `  ${pad(skill.name, 14)} ${getProgressBar(skill.value)}   ${skill.value}%`
        )
      );
    });

    lines.push(createLine(""));
  });

  return lines;
}

function getProjectsLines(): TerminalLine[] {
  return [
    "[01] HackFlow AI",
    "     Stack: Next.js, Node.js, PostgreSQL, FastAPI",
    "     AI-powered hackathon platform with auto-evaluation",
    "[02] Rakshak Fraud Platform",
    "     Stack: Node.js, MongoDB, OpenAI, Docker, Redis",
    "     Enterprise fraud detection with AI scoring",
    "[03] AI Credit Advisor",
    "     Stack: React, Node.js, OpenAI API, Recharts",
    "     Credit risk scoring with explainable AI",
  ].map((line) =>
    createLine(line, line.startsWith("[") ? "success" : "default")
  );
}

function getEducationLines(): TerminalLine[] {
  return [
    "University: University of Engineering & Management, Jaipur",
    "Degree:     B.Tech CSE (2024-2028)",
    "CGPA:       8.0 / 10.0",
  ].map((line) => createLine(line));
}

function getAchievementsLines(): TerminalLine[] {
  return [
    "3x Internal Hackathon Winner (100+ teams each)",
    "2x National Hackathon Finalist",
    "1x International Hackathon Finalist",
  ].map((line) => createLine(line, "success"));
}

function getContactLines(): TerminalLine[] {
  return [
    "Email:    ashish863863@gmail.com",
    "GitHub:   github.com/AshishXoTech",
    "LinkedIn: linkedin.com/in/ashish-kumar-jha-43887726b",
  ].map((line) => createLine(line));
}

function getNeofetchLines(): TerminalLine[] {
  const logo = [
    "    ___        __    ",
    "   /   | _____/ /_   ",
    "  / /| |/ ___/ __ \\  ",
    " / ___ / /__/ / / /  ",
    "/_/  |_\\___/_/ /_/   ",
    "                     ",
    "     AshishOS        ",
  ];

  const info = [
    "OS:      AshishOS 1.0.0",
    "Host:    UEM Jaipur, Rajasthan",
    "Kernel:  Next.js 14 LTS",
    "CPU:     Brain at 3.6GHz, chai-cooled",
    "Memory:  8.0 GPA out of 10.0",
    "Stack:   MERN, TypeScript, FastAPI, PostgreSQL",
    "Services: Redis, Docker, Prisma, JWT, OpenAI API",
    "Projects: HackFlow AI, Rakshak, AI Credit Advisor",
    "Hacks:   3 Wins, 2 National, 1 International",
    "Now:     Java + DSA + System Design",
    "Status:  Open to Software Engineer opportunities",
  ];

  const maxRows = Math.max(logo.length, info.length);

  return Array.from({ length: maxRows }, (_, index) =>
    createSegmentLine([
      { text: pad(logo[index] ?? "", 25), tone: "success" },
      { text: info[index] ?? "", tone: "default" },
    ])
  );
}

function getGitLogLines(): TerminalLine[] {
  return [
    "a3f2b1c  feat: ship HackFlow AI before the deadline remembered me",
    "7d8e9f0  feat: add RBAC without pretending auth is easy",
    "2c4a6b8  fix: undefined bug found at 3:07am",
    "9e1c3d5  feat: connect OpenAI scoring to real product flows",
    "4b7d2f1  fix: Docker worked locally after only mild emotional damage",
    "1c8e9a3  chore: start Java DSA grind, no shortcuts",
  ].map((line) => createLine(line));
}

function getSudoHireLines(): TerminalLine[] {
  return [
    "[          ] 0%",
    "[██        ] 25%",
    "[█████     ] 50%",
    "[████████  ] 80%",
    "[██████████] 100%",
    "ACCESS GRANTED",
    "",
    "Level: SOFTWARE_ENGINEER_CANDIDATE",
    "Reason: Ships full-stack systems, understands pressure, still learning fundamentals.",
    "Evidence: 3 hackathon wins, 2 national finals, 1 international final.",
    "Stack: Next.js, TypeScript, Node.js, FastAPI, PostgreSQL, Redis, Docker, OpenAI API.",
    "Current mission: Java, DSA, System Design.",
    "",
    "You made an excellent decision.",
    "Contact: ashish863863@gmail.com",
  ].map((line) =>
    createLine(
      line,
      line === "ACCESS GRANTED" || line.startsWith("Level:")
        ? "success"
        : "default"
    )
  );
}

function getRmRfLines(): TerminalLine[] {
  return [
    "Removing ./src... permission denied",
    "Removing ./components... permission denied",
    "Removing ./projects... permission denied",
    "Removing node_modules... this could take a while",
    "...",
    "ERROR: Cannot delete greatness.",
    "AshishOS protection mode is active.",
    "Try shipping another feature instead.",
  ].map((line) =>
    createLine(line, line.startsWith("ERROR") ? "error" : "default")
  );
}

function getUnknownLines(command: string): TerminalLine[] {
  return [
    createLine(`bash: ${command}: command not found`, "error"),
    createLine("Type help for available commands.", "muted"),
  ];
}

interface AnimatedLineProps {
  line: TerminalLine;
  onComplete: () => void;
  onTick: () => void;
}

function AnimatedLine({
  line,
  onComplete,
  onTick,
}: AnimatedLineProps): JSX.Element {
  const [visibleLength, setVisibleLength] = useState(0);
  const completedRef = useRef(false);
  const lastScrollAtRef = useRef(0);
  const text = useMemo(() => getLineText(line), [line]);

  useEffect(() => {
    completedRef.current = false;
    lastScrollAtRef.current = 0;
    setVisibleLength(0);

    if (text.length === 0) {
      completedRef.current = true;
      onComplete();
      return undefined;
    }

    const startedAt = performance.now();
    let frameId = 0;

    const animate = (now: number) => {
      const elapsed = now - startedAt;
      const nextLength = Math.min(text.length, Math.max(1, Math.floor(elapsed / line.speed)));

      setVisibleLength((current) => (nextLength > current ? nextLength : current));

      if (now - lastScrollAtRef.current > SCROLL_THROTTLE_MS || nextLength >= text.length) {
        lastScrollAtRef.current = now;
        onTick();
      }

      if (nextLength >= text.length) {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
        return;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [line.id, line.speed, onComplete, onTick, text.length]);

  return <RenderedLine line={line} visibleLength={visibleLength} />;
}

function RenderedLine({
  line,
  visibleLength,
}: {
  line: TerminalLine;
  visibleLength?: number;
}): JSX.Element {
  let remaining =
    typeof visibleLength === "number" ? visibleLength : getLineText(line).length;

  return (
    <p className="min-h-[1.75em] whitespace-pre-wrap">
      {line.segments.map((segment, index) => {
        const visibleText =
          remaining > 0 ? segment.text.slice(0, remaining) : "";
        remaining -= segment.text.length;

        return (
          <span key={`${segment.text}-${index}`} className={TONE_CLASSES[segment.tone]}>
            {visibleText}
          </span>
        );
      })}
    </p>
  );
}

export default function TerminalApp({ showcase = false }: TerminalAppProps): JSX.Element {
  const { openApp } = useOS();
  const [lines, setLines] = useState<TerminalLine[]>(getWelcomeLines);
  const [inputValue, setInputValue] = useState("");
  const [completedLineIds, setCompletedLineIds] = useState<Set<string>>(
    new Set()
  );
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const draftRef = useRef("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeLine = lines.find((line) => !completedLineIds.has(line.id));

  const scrollToBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, completedLineIds, scrollToBottom]);

  const handleLineComplete = useCallback((lineId: string) => {
    setCompletedLineIds((current) => new Set(current).add(lineId));
  }, []);

  const appendLines = useCallback((nextLines: TerminalLine[]) => {
    setLines((current) => [...current, ...nextLines].slice(-MAX_TERMINAL_LINES));
  }, []);

  const clearTerminal = useCallback(() => {
    setLines([]);
    setCompletedLineIds(new Set());
  }, []);

  const executeCommand = useCallback(
    (rawInput: string) => {
      const commandText = rawInput.trim();
      setHistoryIndex(null);

      if (commandText) {
        setCommandHistory((current) =>
          [...current, commandText].slice(-MAX_HISTORY)
        );
      }

      if (commandText.toLowerCase() === "clear") {
        clearTerminal();
        return;
      }

      const inputLine = createSegmentLine(
        [
          { text: PROMPT, tone: "prompt" },
          { text: commandText, tone: "default" },
        ],
        OUTPUT_TYPEWRITER_MS
      );

      if (!commandText) {
        appendLines([inputLine]);
        setCompletedLineIds((current) => new Set(current).add(inputLine.id));
        return;
      }

      const lower = commandText.toLowerCase();
      const [baseCommand, ...args] = commandText.split(/\s+/);
      const normalizedBase = baseCommand?.toLowerCase() ?? "";
      let outputLines: TerminalLine[];

      if (lower === "help") {
        outputLines = getHelpLines();
      } else if (lower === "whoami") {
        outputLines = getWhoamiLines();
      } else if (lower === "skills") {
        outputLines = getSkillsLines();
      } else if (lower === "projects") {
        outputLines = getProjectsLines();
      } else if (lower === "education") {
        outputLines = getEducationLines();
      } else if (lower === "achievements") {
        outputLines = getAchievementsLines();
      } else if (lower === "contact") {
        outputLines = getContactLines();
      } else if (lower === "neofetch") {
        outputLines = getNeofetchLines();
      } else if (lower === "git log") {
        outputLines = getGitLogLines();
      } else if (lower === "cat resume.pdf") {
        outputLines = [createLine("Fetching /public/resume.pdf... done.")];
        window.open("/resume.pdf", "_blank");
      } else if (lower === "sudo hire ashish") {
        outputLines = getSudoHireLines();
      } else if (lower === "rm -rf portfolio") {
        outputLines = getRmRfLines();
      } else if (normalizedBase === "open") {
        const appName = args.join(" ").toLowerCase();
        const appId = OPENABLE_APPS.find((app) => app === appName);

        if (appId) {
          openApp(appId);
          outputLines = [createLine(`Opening ${appId}...`, "success")];
        } else {
          outputLines = [
            createLine(
              "bash: app not found. Valid: about projects skills achievements blog contact",
              "error"
            ),
          ];
        }
      } else {
        outputLines = getUnknownLines(commandText);
      }

      appendLines([inputLine, ...outputLines]);
      setCompletedLineIds((current) => new Set(current).add(inputLine.id));
    },
    [appendLines, clearTerminal, openApp]
  );

  const navigateHistory = useCallback(
    (direction: "up" | "down"): string | null => {
      if (commandHistory.length === 0) return null;

      if (direction === "up") {
        if (historyIndex === null) {
          draftRef.current = inputValue;
        }

        const nextIndex =
          historyIndex === null
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        return commandHistory[nextIndex] ?? null;
      }

      if (historyIndex === null) return null;

      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(null);
        return draftRef.current;
      }

      setHistoryIndex(nextIndex);
      return commandHistory[nextIndex] ?? null;
    },
    [commandHistory, historyIndex, inputValue]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      clearTerminal();
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const lowerInput = inputValue.toLowerCase();
      const suggestion = AUTOCOMPLETE_COMMANDS.find((command) =>
        command.startsWith(lowerInput)
      );
      if (suggestion) setInputValue(suggestion);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const previous = navigateHistory("up");
      if (previous !== null) setInputValue(previous);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = navigateHistory("down");
      if (next !== null) setInputValue(next);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    executeCommand(inputValue);
    setInputValue("");
  };

  const runQuickCommand = (command: string): void => {
    executeCommand(command);
    setInputValue("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={[
        "flex flex-col font-mono text-[13px] leading-[1.75]",
        showcase ? "" : "h-full min-h-[360px]",
      ].join(" ")}
      onClick={() => inputRef.current?.focus()}
      role="presentation"
    >
      <div
        className={[
          "terminal-window-shell flex flex-col overflow-hidden rounded-2xl bg-[#030310]",
          showcase ? "h-[520px]" : "min-h-0 flex-1",
        ].join(" ")}
      >
        <div className="flex h-11 shrink-0 items-center border-b border-white/[0.04] bg-[#0a0a18] px-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28ca42]" />
          </div>
          <div className="flex flex-1 justify-center font-mono text-[11px] text-[#555]">
            terminal.sh — bash
          </div>
          <div className="hidden items-center gap-2 font-mono text-[9px] sm:flex">
            <span className="inline-flex items-center gap-1.5 text-green/60">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
              LIVE
            </span>
            <span className="text-[#333]">|</span>
            <span className="text-[#333]">AshishOS v1.0.0</span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-5">
          <div
            ref={containerRef}
            className="window-scrollbar min-h-0 flex-1 overflow-y-auto"
          >
            {lines.map((line) => {
              if (activeLine?.id === line.id) {
                return (
                  <AnimatedLine
                    key={line.id}
                    line={line}
                    onComplete={() => handleLineComplete(line.id)}
                    onTick={scrollToBottom}
                  />
                );
              }

              if (!completedLineIds.has(line.id)) return null;

              return <RenderedLine key={line.id} line={line} />;
            })}
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-2 flex shrink-0 items-center gap-2 border-t border-white/[0.03] pt-2"
          >
            <span className="shrink-0 text-[#00ff41]">{PROMPT}</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="min-w-0 flex-1 border-0 bg-transparent text-[#e0e0e0] caret-green outline-none ring-0 focus:outline-none focus:ring-0"
              aria-label="Terminal command input"
            />
          </form>
        </div>
      </div>

      {showcase ? (
        <div className="terminal-command-chips mt-5 flex flex-wrap justify-center gap-2 rounded-full bg-[rgba(8,8,20,0.6)] px-5 py-3">
          {QUICK_COMMANDS.map((command) => (
            <button
              key={command}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                runQuickCommand(command);
              }}
              className="rounded-full border border-white/[0.06] px-3.5 py-1.5 font-mono text-[11px] text-[#444] transition hover:border-green/20 hover:bg-green/[0.04] hover:text-green"
            >
              {command}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
