"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  SKILL_TABS,
  getSkillsByTab,
  type SkillTab,
} from "@/lib/data/skills";
import type { Skill, SkillCategoryName } from "@/types";
import { cn } from "@/lib/utils";

type ProficiencyLevel = "expert" | "advanced" | "learning";

function getProficiencyLevel(percent: number): ProficiencyLevel {
  if (percent > 85) return "expert";
  if (percent > 65) return "advanced";
  return "learning";
}

function getBarColor(percent: number): string {
  const level = getProficiencyLevel(percent);
  if (level === "expert") return "#00ff41";
  if (level === "advanced") return "#7c3aed";
  return "#ff8c00";
}

const CATEGORY_BADGE_STYLES: Record<SkillCategoryName, string> = {
  Frontend: "bg-[#00ff4120] text-[#00ff41] border-[#00ff41]/40",
  Backend: "bg-[#7c3aed20] text-[#7c3aed] border-[#7c3aed]/40",
  Database: "bg-[#00ff4120] text-[#00ff41] border-[#00ff41]/30",
  DevOps: "bg-[#88888820] text-[#aaaaaa] border-[#888888]/40",
  "AI/ML": "bg-[#7c3aed20] text-[#7c3aed] border-[#7c3aed]/40",
  Learning: "bg-[#ff8c0020] text-[#ff8c00] border-[#ff8c00]/40",
};

function getAbbreviation(name: string): string {
  const words = name.replace(/[./]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

interface SkillRowProps {
  skill: Skill;
}

function SkillRow({ skill }: SkillRowProps): JSX.Element {
  const barColor = getBarColor(skill.proficiency);
  const abbrev = getAbbreviation(skill.name);

  return (
    <motion.div
      variants={rowVariants}
      className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,0.7fr)_minmax(0,1.2fr)] items-center gap-3 border-b border-[rgba(255,255,255,0.04)] px-2 py-2.5 transition-colors duration-200 hover:bg-[rgba(255,255,255,0.03)]"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[#00ff41]/30 bg-[#00ff4115] font-mono text-[9px] font-bold text-[#00ff41]"
          aria-hidden="true"
        >
          {abbrev}
        </span>
        <span className="truncate font-mono text-[13px] text-[#e0e0e0]">
          {skill.name}
        </span>
      </div>

      <div>
        <span
          className={cn(
            "inline-block rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide",
            CATEGORY_BADGE_STYLES[skill.category]
          )}
        >
          {skill.category}
        </span>
      </div>

      <span className="font-mono text-[11px] text-[#555555]">{skill.version}</span>

      <div className="flex min-w-0 items-center gap-2">
        <div className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#1a1a1a]">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: barColor }}
            initial={{ width: 0 }}
            animate={{ width: `${skill.proficiency}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 18, duration: 1 }}
          />
        </div>
        <span
          className="w-8 shrink-0 text-right font-mono text-[11px] tabular-nums"
          style={{ color: barColor }}
        >
          {skill.proficiency}%
        </span>
      </div>
    </motion.div>
  );
}

export function SkillsApp(): JSX.Element {
  const [activeTab, setActiveTab] = useState<SkillTab>("All");

  const filteredSkills = useMemo(
    () => getSkillsByTab(activeTab),
    [activeTab]
  );

  return (
    <div className="flex h-full min-h-[420px] flex-col bg-[#0a0a0a]">
      <nav
        className="flex shrink-0 gap-1 overflow-x-auto border-b border-[rgba(255,255,255,0.06)] px-1"
        aria-label="Skill categories"
      >
        {SKILL_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2.5 font-mono text-[11px] transition-colors",
              activeTab === tab
                ? "border-[#00ff41] text-[#00ff41]"
                : "border-transparent text-[#888888] hover:text-[#e0e0e0]"
            )}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="window-scrollbar min-h-0 flex-1 overflow-y-auto p-3">
        <div
          className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,0.7fr)_minmax(0,1.2fr)] gap-3 border-b border-[rgba(255,255,255,0.08)] px-2 pb-2"
          aria-hidden="true"
        >
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#555555]">
            Process
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#555555]">
            Category
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#555555]">
            Version
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#555555]">
            CPU Usage
          </span>
        </div>

        <motion.div
          key={activeTab}
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredSkills.map((skill) => (
            <SkillRow key={skill.id} skill={skill} />
          ))}
        </motion.div>

        {filteredSkills.length === 0 && (
          <p className="py-8 text-center font-mono text-xs text-[#555555]">
            No processes in this category.
          </p>
        )}
      </div>
    </div>
  );
}
