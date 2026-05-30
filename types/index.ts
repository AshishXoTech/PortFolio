export type {
  AppId,
  BootStage,
  OSContextType,
  WindowPosition,
  WindowSize,
  WindowState,
} from "./os";

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  github?: string;
  live?: string;
  featured: boolean;
}

export type SkillCategoryName =
  | "Frontend"
  | "Backend"
  | "Database"
  | "DevOps"
  | "AI/ML"
  | "Learning";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategoryName;
  version: string;
  proficiency: number;
}

/** @deprecated Use `skills` from lib/data/skills.ts */
export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  year: string;
  level: "internal" | "national" | "international";
}

export interface TerminalCommand {
  command: string;
  output: string | string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
