import type { Skill, SkillCategoryName } from "@/types";

export const skills: Skill[] = [
  // Frontend
  { id: "react", name: "React.js", category: "Frontend", version: "v18.3.1", proficiency: 90 },
  { id: "nextjs", name: "Next.js", category: "Frontend", version: "v14.2", proficiency: 88 },
  { id: "typescript", name: "TypeScript", category: "Frontend", version: "v5.7", proficiency: 82 },
  { id: "tailwind", name: "Tailwind CSS", category: "Frontend", version: "v3.4", proficiency: 85 },
  { id: "framer", name: "Framer Motion", category: "Frontend", version: "v11.15", proficiency: 72 },
  { id: "htmlcss", name: "HTML/CSS", category: "Frontend", version: "v5.0", proficiency: 92 },

  // Backend
  { id: "nodejs", name: "Node.js", category: "Backend", version: "v20 LTS", proficiency: 88 },
  { id: "express", name: "Express.js", category: "Backend", version: "v4.21", proficiency: 86 },
  { id: "fastapi", name: "FastAPI", category: "Backend", version: "v0.115", proficiency: 70 },
  { id: "rest", name: "REST APIs", category: "Backend", version: "v2.0", proficiency: 90 },
  { id: "jwt", name: "JWT Auth", category: "Backend", version: "v9.0", proficiency: 85 },
  { id: "rbac", name: "RBAC", category: "Backend", version: "v1.0", proficiency: 80 },

  // Database
  { id: "mongodb", name: "MongoDB", category: "Database", version: "v7.0", proficiency: 84 },
  { id: "postgresql", name: "PostgreSQL", category: "Database", version: "v16", proficiency: 80 },
  { id: "redis", name: "Redis", category: "Database", version: "v7.4", proficiency: 72 },
  { id: "prisma", name: "Prisma ORM", category: "Database", version: "v5.22", proficiency: 78 },
  { id: "mongoose", name: "Mongoose", category: "Database", version: "v8.8", proficiency: 82 },

  // DevOps
  { id: "docker", name: "Docker", category: "DevOps", version: "v27", proficiency: 78 },
  { id: "git", name: "Git/GitHub", category: "DevOps", version: "v2.47", proficiency: 90 },
  { id: "postman", name: "Postman", category: "DevOps", version: "v11", proficiency: 85 },

  // AI/ML
  { id: "openai", name: "OpenAI API", category: "AI/ML", version: "v4.0", proficiency: 80 },
  { id: "llm", name: "LLM Integration", category: "AI/ML", version: "v1.0", proficiency: 72 },
  { id: "nlp", name: "NLP Basics", category: "AI/ML", version: "v0.9", proficiency: 60 },

  // Learning
  { id: "java", name: "Java", category: "Learning", version: "v21", proficiency: 45 },
  { id: "dsa", name: "DSA", category: "Learning", version: "v1.0", proficiency: 50 },
  { id: "system-design", name: "System Design", category: "Learning", version: "v1.0", proficiency: 40 },
];

export const SKILL_TABS = [
  "All",
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "AI/ML",
] as const;

export type SkillTab = (typeof SKILL_TABS)[number];

export function getSkillsByTab(tab: SkillTab): Skill[] {
  if (tab === "All") return skills;
  return skills.filter((skill) => skill.category === tab);
}

export function getSkillsByCategory(category: SkillCategoryName): Skill[] {
  return skills.filter((skill) => skill.category === category);
}

/** @deprecated Use `skills` array */
export const skillCategories = [
  { name: "Frontend", skills: getSkillsByCategory("Frontend").map((s) => s.name) },
  { name: "Backend", skills: getSkillsByCategory("Backend").map((s) => s.name) },
  { name: "Database", skills: getSkillsByCategory("Database").map((s) => s.name) },
  { name: "DevOps", skills: getSkillsByCategory("DevOps").map((s) => s.name) },
  { name: "AI/ML", skills: getSkillsByCategory("AI/ML").map((s) => s.name) },
  { name: "Learning", skills: getSkillsByCategory("Learning").map((s) => s.name) },
];

export function getAllSkills(): string[] {
  return skills.map((skill) => skill.name);
}
