"use client";

import { achievements } from "@/lib/data/achievements";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";

const levelVariant: Record<
  (typeof achievements)[number]["level"],
  "green" | "purple" | "red"
> = {
  internal: "green",
  national: "purple",
  international: "red",
};

const levelLabel: Record<(typeof achievements)[number]["level"], string> = {
  internal: "Internal",
  national: "National",
  international: "International",
};

export function AchievementsApp(): JSX.Element {
  return (
    <div className="space-y-3">
      {achievements.map((achievement) => (
        <GlassCard key={achievement.id} className="p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="font-mono text-sm text-text">{achievement.title}</h3>
            <Badge variant={levelVariant[achievement.level]}>
              {levelLabel[achievement.level]}
            </Badge>
          </div>
          <p className="text-xs leading-relaxed text-muted">
            {achievement.description}
          </p>
          <p className="mt-2 font-mono text-xs text-green">{achievement.year}</p>
        </GlassCard>
      ))}
    </div>
  );
}
