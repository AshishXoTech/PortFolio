"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Database"
  | "DevOps"
  | "AI/ML"
  | "Learning";

interface Skill {
  category: SkillCategory;
  name: string;
  value: number;
}

interface CategoryMeta {
  color: string;
  description: string;
  label: SkillCategory;
  light: string;
  rgb: string;
  wash: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    label: "Frontend",
    color: "#00ff41",
    light: "#65ff8d",
    rgb: "0, 255, 65",
    wash: "rgba(0,255,65,0.012)",
    description: "React ecosystem. Production UI. Component architecture.",
  },
  {
    label: "Backend",
    color: "#7c3aed",
    light: "#9d5ff5",
    rgb: "124, 58, 237",
    wash: "rgba(124,58,237,0.015)",
    description: "Node, Express, FastAPI. REST APIs. Auth systems.",
  },
  {
    label: "Database",
    color: "#ff003c",
    light: "#ff5f7e",
    rgb: "255, 0, 60",
    wash: "rgba(255,0,60,0.014)",
    description: "MongoDB, PostgreSQL, Redis. ORM layers. Query design.",
  },
  {
    label: "DevOps",
    color: "#ffbd2e",
    light: "#ffd166",
    rgb: "255, 189, 46",
    wash: "rgba(255,189,46,0.014)",
    description: "Docker, Git workflows. Container deployment.",
  },
  {
    label: "AI/ML",
    color: "#00bfff",
    light: "#6ee7ff",
    rgb: "0, 191, 255",
    wash: "rgba(0,191,255,0.014)",
    description: "OpenAI API integration. LLM pipelines. AI products.",
  },
  {
    label: "Learning",
    color: "#ff8c00",
    light: "#ffbd2e",
    rgb: "255, 140, 0",
    wash: "rgba(255,140,0,0.014)",
    description: "Currently compiling Java + DSA + System Design.",
  },
];

const SKILLS: Skill[] = [
  { name: "React.js", category: "Frontend", value: 90 },
  { name: "Next.js", category: "Frontend", value: 88 },
  { name: "TypeScript", category: "Frontend", value: 82 },
  { name: "Tailwind", category: "Frontend", value: 85 },
  { name: "Framer Motion", category: "Frontend", value: 72 },
  { name: "HTML/CSS", category: "Frontend", value: 92 },
  { name: "Node.js", category: "Backend", value: 88 },
  { name: "Express.js", category: "Backend", value: 86 },
  { name: "FastAPI", category: "Backend", value: 70 },
  { name: "REST APIs", category: "Backend", value: 90 },
  { name: "JWT Auth", category: "Backend", value: 85 },
  { name: "RBAC", category: "Backend", value: 80 },
  { name: "MongoDB", category: "Database", value: 84 },
  { name: "PostgreSQL", category: "Database", value: 80 },
  { name: "Redis", category: "Database", value: 72 },
  { name: "Prisma ORM", category: "Database", value: 78 },
  { name: "Mongoose", category: "Database", value: 82 },
  { name: "Docker", category: "DevOps", value: 78 },
  { name: "Git/GitHub", category: "DevOps", value: 92 },
  { name: "Postman", category: "DevOps", value: 85 },
  { name: "OpenAI API", category: "AI/ML", value: 80 },
  { name: "LLM Integration", category: "AI/ML", value: 72 },
  { name: "Java", category: "Learning", value: 45 },
  { name: "DSA", category: "Learning", value: 50 },
  { name: "System Design", category: "Learning", value: 40 },
];

const FLOATING_LABELS = [
  { label: "FRONTEND", className: "left-[-5%] top-[18%] -rotate-6" },
  { label: "BACKEND", className: "right-[-4%] top-[8%] rotate-6" },
  { label: "DATABASE", className: "bottom-[24%] left-[12%] rotate-3" },
  { label: "DEVOPS", className: "bottom-[8%] right-[18%] -rotate-3" },
  { label: "AI/ML", className: "left-[44%] top-[42%] rotate-6" },
];

function getCategoryMeta(category: SkillCategory): CategoryMeta {
  return CATEGORIES.find((item) => item.label === category) ?? CATEGORIES[0];
}

function getSkillColor(category: SkillCategory, value: number): string {
  if (category === "Learning") return "#ff8c00";
  if (category === "Frontend") {
    if (value >= 90) return "#00ff41";
    if (value >= 80) return "#00d435";
    return "#009922";
  }
  if (category === "Backend") {
    if (value >= 90) return "#9d5ff5";
    if (value >= 80) return "#7c3aed";
    return "#5c1dad";
  }

  return getCategoryMeta(category).color;
}

function getSkillShadow(category: SkillCategory, value: number): string {
  const meta = getCategoryMeta(category);
  if (value < 90 || category === "Learning") return "none";
  return `0 0 12px rgba(${meta.rgb}, 0.6)`;
}

function SkillRow({
  hasEntered,
  index,
  isVisible,
  skill,
}: {
  hasEntered: boolean;
  index: number;
  isVisible: boolean;
  skill: Skill;
}): JSX.Element {
  const [isFilled, setIsFilled] = useState(false);
  const color = getSkillColor(skill.category, skill.value);
  const meta = getCategoryMeta(skill.category);
  const isExpert = skill.value >= 90 && skill.category !== "Learning";

  useEffect(() => {
    setIsFilled(false);

    if (!hasEntered || !isVisible) return undefined;

    const timeoutId = window.setTimeout(() => {
      setIsFilled(true);
    }, 80 + index * 70);

    return () => window.clearTimeout(timeoutId);
  }, [hasEntered, index, isVisible, skill.name]);

  return (
    <div
      className={[
        "group flex h-[52px] items-center gap-4 border-b border-white/[0.03] pl-1 transition-all duration-200 hover:rounded-lg hover:bg-white/[0.02] hover:pl-3",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0",
      ].join(" ")}
      style={{ transitionDelay: isVisible ? `${index * 40}ms` : "0ms" }}
    >
      <span className="w-[160px] shrink-0 font-sans text-sm text-[#e0e0e0]">
        {skill.name}
      </span>
      <div className="relative h-0.5 flex-1 overflow-hidden rounded bg-white/[0.05]">
        <div
          className={isExpert ? "skill-fill-shimmer h-full rounded" : "h-full rounded"}
          style={{
            "--skill-color": color,
            "--skill-light": meta.light,
            background: isExpert
              ? `linear-gradient(90deg, ${color}, ${meta.light}, ${color})`
              : color,
            backgroundSize: isExpert ? "200% 100%" : undefined,
            boxShadow: getSkillShadow(skill.category, skill.value),
            transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            width: isFilled ? `${skill.value}%` : "0%",
          } as CSSProperties & {
            "--skill-color": string;
            "--skill-light": string;
          }}
        />
      </div>
      <span
        className="w-9 text-right font-mono text-xs font-semibold tabular-nums"
        style={{ color }}
      >
        {skill.value}%
      </span>
    </div>
  );
}

export function SkillsApp(): JSX.Element {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("Frontend");
  const [hasEntered, setHasEntered] = useState(false);
  const [rowsVisible, setRowsVisible] = useState(true);

  const activeMeta = getCategoryMeta(activeCategory);
  const filteredSkills = useMemo(
    () => SKILLS.filter((skill) => skill.category === activeCategory),
    [activeCategory]
  );

  const ecosystemGroups = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        ...category,
        skills: SKILLS.filter((skill) => skill.category === category.label),
      })),
    []
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setHasEntered(true);
        observer.disconnect();
      },
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const selectCategory = (category: SkillCategory) => {
    if (category === activeCategory) return;

    setRowsVisible(false);
    setTimeout(() => {
      setActiveCategory(category);
      requestAnimationFrame(() => setRowsVisible(true));
    }, 200);
  };

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050510] px-6 py-16 md:px-12"
    >
      {FLOATING_LABELS.map((item) => (
        <span
          key={item.label}
          className={[
            "pointer-events-none absolute font-display text-[clamp(72px,9vw,120px)] font-black leading-none text-white/[0.012]",
            item.className,
          ].join(" ")}
          aria-hidden="true"
        >
          {item.label}
        </span>
      ))}

      <div className="relative z-10 mx-auto w-full max-w-[1200px]">
        <header className="mb-10 max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#333]">
            05 / Tech Stack
          </p>
          <h2 className="mt-3 font-display text-[clamp(48px,7vw,72px)] font-black leading-[0.9] tracking-[-0.04em] text-[#e8e8f0]">
            The stack I
            <span className="block text-green">actually use.</span>
          </h2>
          <p className="mt-3 font-sans text-[15px] leading-7 text-muted">
            Not a checklist. Tools I have used to ship production systems.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[35fr_65fr]">
          <aside>
            <nav className="flex flex-col gap-1" aria-label="Skill categories">
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category.label;

                return (
                  <button
                    key={category.label}
                    type="button"
                    onClick={() => selectCategory(category.label)}
                    className={[
                      "border-l-2 px-5 py-3 text-left font-mono text-xs uppercase tracking-[0.08em] transition-all duration-200",
                      isActive
                        ? "bg-white/[0.04] text-[#e8e8f0]"
                        : "border-transparent bg-transparent text-[#444] hover:text-[#888]",
                    ].join(" ")}
                    style={{ borderLeftColor: isActive ? category.color : "transparent" }}
                  >
                    {category.label}
                  </button>
                );
              })}
            </nav>

            <p className="pt-5 font-mono text-xs leading-[1.7] text-[#555]">
              {activeMeta.description}
            </p>
          </aside>

          <div
            className="relative overflow-hidden rounded-2xl border border-white/[0.055] p-6 transition-colors duration-500"
            style={{ background: activeMeta.wash }}
          >
            <div className="pointer-events-none absolute inset-x-6 bottom-6 top-10" aria-hidden="true">
              {[25, 50, 75, 100].map((value) => (
                <div
                  key={value}
                  className="absolute bottom-0 top-0 w-px bg-white/[0.02]"
                  style={{ left: `${value}%` }}
                >
                  <span className="absolute -top-5 -translate-x-1/2 font-mono text-[9px] text-[#1a1a2a]">
                    {value}%
                  </span>
                </div>
              ))}
            </div>

            <div key={activeCategory} className="relative z-10">
              {filteredSkills.map((skill, index) => (
                <SkillRow
                  key={skill.name}
                  hasEntered={hasEntered}
                  index={index}
                  isVisible={rowsVisible}
                  skill={skill}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.055] bg-[rgba(8,8,20,0.56)] p-5 backdrop-blur-xl">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#333]">
            Tech Ecosystem Map
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {ecosystemGroups.map((group) => (
              <div key={group.label} className="flex flex-wrap items-center gap-2">
                {group.skills.map((skill, index) => (
                  <span
                    key={skill.name}
                    title={`${skill.name}: ${skill.value}%`}
                    className="skill-ecosystem-pill relative rounded-full border px-3 py-1.5 font-mono text-[10px] transition duration-200 hover:scale-110"
                    style={{
                      animationDuration: `${4 + ((index + group.label.length) % 5)}s`,
                      backgroundColor: `rgba(${group.rgb}, 0.055)`,
                      borderColor: `rgba(${group.rgb}, 0.22)`,
                      boxShadow: `0 0 0 rgba(${group.rgb}, 0)`,
                      color: group.color,
                    }}
                  >
                    {index > 0 ? (
                      <span
                        className="pointer-events-none absolute right-full top-1/2 h-px w-8 -translate-y-1/2"
                        style={{ backgroundColor: `rgba(${group.rgb}, 0.12)` }}
                        aria-hidden="true"
                      />
                    ) : null}
                    {skill.name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
