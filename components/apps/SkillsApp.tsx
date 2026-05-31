"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Database"
  | "DevOps"
  | "AI"
  | "Learning";

type SkillTab = "All" | SkillCategory;

interface SkillProcess {
  category: SkillCategory;
  name: string;
  proficiency: number;
}

interface CategoryStyle {
  color: string;
  rgb: string;
}

const TABS: SkillTab[] = [
  "All",
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "AI",
  "Learning",
];

const SKILLS: SkillProcess[] = [
  { name: "React.js", category: "Frontend", proficiency: 90 },
  { name: "Next.js", category: "Frontend", proficiency: 88 },
  { name: "TypeScript", category: "Frontend", proficiency: 82 },
  { name: "Tailwind CSS", category: "Frontend", proficiency: 85 },
  { name: "Framer Motion", category: "Frontend", proficiency: 72 },
  { name: "HTML CSS", category: "Frontend", proficiency: 92 },
  { name: "Node.js", category: "Backend", proficiency: 88 },
  { name: "Express.js", category: "Backend", proficiency: 86 },
  { name: "FastAPI", category: "Backend", proficiency: 70 },
  { name: "REST APIs", category: "Backend", proficiency: 90 },
  { name: "JWT Auth", category: "Backend", proficiency: 85 },
  { name: "RBAC", category: "Backend", proficiency: 80 },
  { name: "MongoDB", category: "Database", proficiency: 84 },
  { name: "PostgreSQL", category: "Database", proficiency: 80 },
  { name: "Redis", category: "Database", proficiency: 72 },
  { name: "Prisma ORM", category: "Database", proficiency: 78 },
  { name: "Mongoose", category: "Database", proficiency: 82 },
  { name: "Docker", category: "DevOps", proficiency: 78 },
  { name: "Git GitHub", category: "DevOps", proficiency: 92 },
  { name: "Postman", category: "DevOps", proficiency: 85 },
  { name: "OpenAI API", category: "AI", proficiency: 80 },
  { name: "LLM Integration", category: "AI", proficiency: 72 },
  { name: "Java", category: "Learning", proficiency: 45 },
  { name: "DSA", category: "Learning", proficiency: 50 },
  { name: "System Design", category: "Learning", proficiency: 40 },
];

const CATEGORY_STYLES: Record<SkillCategory, CategoryStyle> = {
  Frontend: { color: "#00ff41", rgb: "0, 255, 65" },
  Backend: { color: "#7c3aed", rgb: "124, 58, 237" },
  Database: { color: "#ff003c", rgb: "255, 0, 60" },
  DevOps: { color: "#ffbd2e", rgb: "255, 189, 46" },
  AI: { color: "#00bfff", rgb: "0, 191, 255" },
  Learning: { color: "#ff8c00", rgb: "255, 140, 0" },
};

function getUsageColor(proficiency: number): string {
  if (proficiency > 85) return "#00ff41";
  if (proficiency >= 65) return "#7c3aed";
  return "#ff8c00";
}

function getUsageShadow(proficiency: number): string {
  if (proficiency > 85) return "0 0 8px rgba(0,255,65,0.5)";
  if (proficiency >= 65) return "0 0 8px rgba(124,58,237,0.5)";
  return "none";
}

interface SkillRowProps {
  hasEntered: boolean;
  index: number;
  skill: SkillProcess;
}

function SkillRow({ hasEntered, index, skill }: SkillRowProps): JSX.Element {
  const categoryStyle = CATEGORY_STYLES[skill.category];
  const usageColor = getUsageColor(skill.proficiency);
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    setIsFilled(false);

    if (!hasEntered) return undefined;

    const frameId = window.requestAnimationFrame(() => {
      setIsFilled(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [hasEntered, skill.name]);

  return (
    <div
      className="grid h-11 grid-cols-[minmax(130px,1.5fr)_minmax(92px,0.8fr)_minmax(120px,1fr)_44px] items-center gap-3 px-3 transition-colors duration-200 odd:bg-[#080814] even:bg-[#060610] hover:bg-[#0c0c1e]"
      style={{ transitionDelay: `${index * 30}ms` }}
    >
      <span className="truncate font-mono text-[13px] text-[#e0e0e0]">
        {skill.name}
      </span>

      <span
        className="inline-flex w-fit items-center gap-1.5 rounded-full border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.05em]"
        style={{
          backgroundColor: `rgba(${categoryStyle.rgb}, 0.15)`,
          borderColor: `rgba(${categoryStyle.rgb}, 0.26)`,
          color: categoryStyle.color,
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: categoryStyle.color }}
          aria-hidden="true"
        />
        {skill.category}
      </span>

      <div className="h-[3px] overflow-hidden rounded-[1px] bg-[#111]">
        <div
          className="h-full rounded-[1px]"
          style={{
            backgroundColor: usageColor,
            boxShadow: getUsageShadow(skill.proficiency),
            transition:
              "width 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
            transitionDelay: `${index * 60}ms`,
            width: isFilled ? `${skill.proficiency}%` : "0%",
          }}
        />
      </div>

      <span
        className="text-right font-mono text-[11px] tabular-nums"
        style={{ color: usageColor }}
      >
        {skill.proficiency}%
      </span>
    </div>
  );
}

export function SkillsApp(): JSX.Element {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<SkillTab>("All");
  const [hasEntered, setHasEntered] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);

  const filteredSkills = useMemo(() => {
    if (activeTab === "All") return SKILLS;
    return SKILLS.filter((skill) => skill.category === activeTab);
  }, [activeTab]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;

        setHasEntered(true);
        observer.disconnect();
      },
      { threshold: 0.25 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setContentVisible(false);

    const frameId = window.requestAnimationFrame(() => {
      setContentVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [activeTab]);

  return (
    <div
      ref={sectionRef}
      className="flex h-full min-h-[420px] flex-col bg-[#050510]"
    >
      <nav
        className="flex shrink-0 gap-1 overflow-x-auto border-b border-[#111] px-2"
        aria-label="Skill process categories"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={[
                "shrink-0 border-b-2 px-3 py-3 font-mono text-[11px] uppercase tracking-[0.05em] transition-colors duration-200",
                isActive
                  ? "border-[#00ff41] text-[#00ff41]"
                  : "border-transparent text-[#444] hover:text-[#e0e0e0]",
              ].join(" ")}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      <div className="window-scrollbar min-h-0 flex-1 overflow-auto p-3">
        <div
          className="grid grid-cols-[minmax(130px,1.5fr)_minmax(92px,0.8fr)_minmax(120px,1fr)_44px] gap-3 border-b border-[#111] px-3 pb-2"
          aria-hidden="true"
        >
          <span className="font-mono text-[10px] text-[#333]">PROCESS</span>
          <span className="font-mono text-[10px] text-[#333]">CATEGORY</span>
          <span className="font-mono text-[10px] text-[#333]">CPU USAGE</span>
          <span className="text-right font-mono text-[10px] text-[#333]">
            %
          </span>
        </div>

        <div
          key={activeTab}
          className={[
            "pt-1 transition-opacity duration-300",
            contentVisible ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          {filteredSkills.map((skill, index) => (
            <SkillRow
              key={`${activeTab}-${skill.name}`}
              hasEntered={hasEntered}
              index={index}
              skill={skill}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
