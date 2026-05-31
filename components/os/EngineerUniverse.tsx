"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LucideIcon } from "lucide-react";
import {
  Code2,
  Cpu,
  FileJson2,
  Github,
  Mail,
  Medal,
  Rocket,
  ServerCog,
  Terminal,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";
import { achievements } from "@/lib/data/achievements";
import { skills } from "@/lib/data/skills";
import { EngineerStory } from "@/components/sections/EngineerStory";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import HeroScene from "@/components/three/HeroScene";
import type { AppId } from "@/types/os";

interface EngineerUniverseProps {
  onOpenApp: (appId: AppId) => void;
  windowActionsEnabled?: boolean;
}

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
}

const STATS: StatItem[] = [
  { label: "Hackathon", value: "3x", icon: Medal },
  { label: "National", value: "2x", icon: Trophy },
  { label: "Intl", value: "1x", icon: Rocket },
  { label: "CGPA", value: "8.0", icon: Cpu },
];

function useUniverseMotion(rootRef: RefObject<HTMLElement>): void {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-universe-scene]").forEach((scene) => {
        gsap.fromTo(
          scene,
          { opacity: 0.55, y: 64 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: scene,
              start: "top 78%",
              end: "top 35%",
              scrub: 0.8,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-project-card]").forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, rotateY: index % 2 === 0 ? -28 : 28, y: 80 },
          {
            opacity: 1,
            rotateY: 0,
            y: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 86%",
              end: "top 48%",
              scrub: 0.8,
            },
          }
        );
      });
    }, root ?? undefined);

    return () => {
      context.revert();
    };
  }, [rootRef]);
}

function AtmosphereLayers(): JSX.Element {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="universe-noise absolute inset-0 opacity-[0.03]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_18%,rgba(0,255,65,0.16),transparent_32%),radial-gradient(ellipse_at_92%_30%,rgba(124,58,237,0.18),transparent_35%),radial-gradient(ellipse_at_18%_72%,rgba(255,0,60,0.08),transparent_30%),radial-gradient(ellipse_at_76%_82%,rgba(245,158,11,0.1),transparent_32%)] blur-2xl" />
      <div className="universe-dot-grid absolute inset-0" />
    </div>
  );
}

function SceneLabel({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}): JSX.Element {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-green">
        {kicker}
      </p>
      <h2 className="mt-3 font-display text-4xl font-bold text-text md:text-6xl">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-7 text-text/70 md:text-lg">
        {body}
      </p>
    </div>
  );
}

export function EngineerUniverse({
  onOpenApp,
  windowActionsEnabled = true,
}: EngineerUniverseProps): JSX.Element {
  const rootRef = useRef<HTMLElement>(null);
  useUniverseMotion(rootRef);

  const topSkills = useMemo(
    () => skills.filter((skill) => skill.category !== "Learning").slice(0, 10),
    []
  );

  return (
    <main ref={rootRef} className="relative z-10 min-h-screen overflow-x-hidden px-4 pb-28 md:px-8">
      <AtmosphereLayers />

      <section
        data-universe-scene
        className="relative min-h-screen overflow-hidden pt-[120px] md:pt-[120px]"
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-0 md:grid-cols-2 md:px-12">
          <div className="min-w-0 md:pr-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/[0.04] px-4 py-1.5 font-mono text-[10px] text-green"
            >
              <span
                className="h-2 w-2 animate-pulse rounded-full bg-green shadow-[0_0_10px_rgba(0,255,65,0.8)]"
                aria-hidden="true"
              />
              Available for opportunities
            </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-3 font-mono text-xs uppercase tracking-[0.32em] text-green"
          >
            AshishOS / Engineer&apos;s Universe
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 max-w-[620px] font-display text-[clamp(40px,5.5vw,72px)] font-black leading-none tracking-[-0.03em] text-[#e8e8f0]"
          >
            Ashish Kumar Jha
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 font-display text-[clamp(18px,2.5vw,32px)] font-bold text-[rgba(232,232,240,0.5)]"
          >
            Full-stack systems under pressure.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10 max-w-[480px] font-sans text-[15px] leading-[1.8] text-[#6a6a8a]"
          >
            I build full-stack products with Next.js, TypeScript, Node.js,
            FastAPI, PostgreSQL, Redis, Docker, Prisma, JWT, and OpenAI API.
            Right now I am sharpening Java, DSA, and system design for a serious
            Software Engineer role.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-10 flex flex-wrap gap-y-4"
          >
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={[
                  "pr-6",
                  index > 0
                    ? "border-l border-[rgba(255,255,255,0.05)] pl-6"
                    : "",
                ].join(" ")}
              >
                <p
                  className="font-display text-[28px] font-bold leading-none"
                  style={{
                    color:
                      index === 0
                        ? "#00ff41"
                        : index === 1
                          ? "#7c3aed"
                          : index === 2
                            ? "#ff003c"
                            : "#f59e0b",
                  }}
                >
                  {stat.value}
                </p>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.08em] text-[#444]">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
          {windowActionsEnabled ? (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onOpenApp("projects")}
                className="inline-flex items-center gap-2 rounded-lg bg-green px-7 py-3 font-mono text-xs font-bold text-background transition hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(0,255,65,0.3)]"
              >
                <Code2 className="h-4 w-4" aria-hidden="true" />
                Open projects
              </button>
              <button
                type="button"
                onClick={() => onOpenApp("terminal")}
                className="inline-flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent px-7 py-3 font-mono text-xs font-bold text-[#888] transition hover:border-[rgba(255,255,255,0.3)] hover:text-[#e0e0e0]"
              >
                <Terminal className="h-4 w-4" aria-hidden="true" />
                Launch terminal
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-lg bg-green px-7 py-3 font-mono text-xs font-bold text-background transition hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(0,255,65,0.3)]"
              >
                <Code2 className="h-4 w-4" aria-hidden="true" />
                View projects
              </a>
              <a
                href="#terminal"
                className="inline-flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent px-7 py-3 font-mono text-xs font-bold text-[#888] transition hover:border-[rgba(255,255,255,0.3)] hover:text-[#e0e0e0]"
              >
                <Terminal className="h-4 w-4" aria-hidden="true" />
                View terminal
              </a>
            </div>
          )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.24, duration: 0.6 }}
            className="relative hidden h-[600px] overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.04)] bg-[rgba(8,8,20,0.35)] md:block"
          >
            <HeroScene />
          </motion.div>
        </div>
      </section>

      <section data-universe-scene className="grid min-h-screen items-center gap-8 py-16 md:grid-cols-[0.9fr_1.1fr]">
        <SceneLabel
          kicker="Scene 02 / Universe"
          title="Rotating code sphere, floating bugs, production intent."
          body="The canvas behind this desktop is the ambient system layer. On mobile, it collapses into CSS light fields so the story stays fast and readable."
        />
        <div className="glass-panel grid gap-4 rounded-lg p-5">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between border-b border-glass py-4 last:border-b-0">
              <div className="flex items-center gap-3">
                <stat.icon className="h-5 w-5 text-gold" aria-hidden="true" />
                <span className="font-mono text-sm text-text/70">{stat.label}</span>
              </div>
              <strong className="font-display text-3xl text-text">{stat.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <EngineerStory />

      <ProjectShowcase />

      <section data-universe-scene className="grid min-h-screen items-center gap-8 py-20 md:grid-cols-[0.85fr_1.15fr]">
        <SceneLabel
          kicker="Scene 05 / Skills"
          title="System monitor for the stack."
          body="The bars track the technologies Ashish is already using in projects, with Java and DSA actively compiling in the learning lane."
        />
        <div className="glass-panel rounded-lg p-5">
          {topSkills.map((skill) => (
            <div key={skill.id} className="mb-4 last:mb-0">
              <div className="mb-2 flex items-center justify-between font-mono text-xs">
                <span className="text-text/78">{skill.name}</span>
                <span className="text-green">{skill.proficiency}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded bg-white/[0.05]">
                <div className="h-full rounded bg-green" style={{ width: `${skill.proficiency}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section data-universe-scene className="min-h-screen py-20">
        <SceneLabel
          kicker="Scene 06 / Wins"
          title="Hackathon timeline with signal."
          body="A record of building quickly, presenting clearly, and reaching competitive rooms beyond campus."
        />
        <div className="mt-10 grid gap-4">
          {achievements.map((achievement) => (
            <article key={achievement.id} className="glass-panel grid gap-3 rounded-lg p-5 md:grid-cols-[120px_1fr]">
              <p className="font-mono text-sm text-gold">{achievement.year}</p>
              <div>
                <h3 className="font-display text-xl font-bold text-text">{achievement.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text/65">{achievement.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section data-universe-scene className="grid min-h-[80vh] items-center gap-6 py-20 md:grid-cols-2">
        <button type="button" onClick={() => onOpenApp("terminal")} disabled={!windowActionsEnabled} className="glass-panel rounded-lg p-5 text-left transition hover:border-green/40 disabled:cursor-default">
          <Terminal className="h-8 w-8 text-green" aria-hidden="true" />
          <h2 className="mt-5 font-display text-3xl font-bold text-text">Scene 07 / Terminal</h2>
          <p className="mt-3 font-mono text-sm leading-7 text-text/65">
            run whoami, projects, skills, wins, contact
          </p>
        </button>
        <button type="button" onClick={() => onOpenApp("contact")} disabled={!windowActionsEnabled} className="glass-panel rounded-lg p-5 text-left transition hover:border-green/40 disabled:cursor-default">
          <FileJson2 className="h-8 w-8 text-purple" aria-hidden="true" />
          <h2 className="mt-5 font-display text-3xl font-bold text-text">Scene 08 / Contact</h2>
          <p className="mt-3 font-mono text-sm leading-7 text-text/65">
            email: ashish863863@gmail.com<br />
            github: AshishXoTech
          </p>
        </button>
      </section>

      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-glass py-8 font-mono text-xs text-text/50">
        <span>B.Tech CSE 2024-2028 / UEM Jaipur</span>
        <span className="inline-flex items-center gap-2">
          <ServerCog className="h-4 w-4 text-green" aria-hidden="true" />
          Software Engineer track: Java + DSA
        </span>
        <span className="inline-flex items-center gap-2">
          <Github className="h-4 w-4" aria-hidden="true" />
          AshishXoTech
        </span>
        <span className="inline-flex items-center gap-2">
          <Mail className="h-4 w-4" aria-hidden="true" />
          ashish863863@gmail.com
        </span>
      </footer>
    </main>
  );
}
