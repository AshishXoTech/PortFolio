import type { Achievement } from "@/types";

export const achievements: Achievement[] = [
  {
    id: "internal-hackathon-1",
    title: "Internal Hackathon Winner",
    description:
      "First place at UEM Jaipur internal hackathon for building an AI-powered developer productivity tool.",
    year: "2024",
    level: "internal",
  },
  {
    id: "internal-hackathon-2",
    title: "Internal Hackathon Winner",
    description:
      "Won university hackathon with a full-stack fraud detection prototype using real-time analytics.",
    year: "2025",
    level: "internal",
  },
  {
    id: "internal-hackathon-3",
    title: "Internal Hackathon Winner",
    description:
      "Led team to victory with HackFlow AI — a hackathon management platform with intelligent judging.",
    year: "2025",
    level: "internal",
  },
  {
    id: "national-finalist-1",
    title: "National Hackathon Finalist",
    description:
      "Reached national finals with Rakshak Fraud Platform, competing against 500+ teams nationwide.",
    year: "2025",
    level: "national",
  },
  {
    id: "national-finalist-2",
    title: "National Hackathon Finalist",
    description:
      "National finalist for AI Credit Risk Advisor at a fintech innovation challenge.",
    year: "2025",
    level: "national",
  },
  {
    id: "international-finalist-1",
    title: "International Hackathon Finalist",
    description:
      "Represented India as an international finalist with an AI-driven enterprise security solution.",
    year: "2025",
    level: "international",
  },
];

export function getAchievementsByLevel(
  level: Achievement["level"]
): Achievement[] {
  return achievements.filter((achievement) => achievement.level === level);
}
