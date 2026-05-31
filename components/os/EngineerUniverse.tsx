"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FileJson2,
  Github,
  Mail,
  ServerCog,
  Terminal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { AchievementsApp } from "@/components/apps/AchievementsApp";
import { SkillsApp } from "@/components/apps/SkillsApp";
import { EngineerStory } from "@/components/sections/EngineerStory";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import HeroScene from "@/components/three/HeroScene";
import type { AppId } from "@/types/os";

interface EngineerUniverseProps {
  onOpenApp: (appId: AppId) => void;
  windowActionsEnabled?: boolean;
}

interface HeroStat {
  color: string;
  label: string;
  value: string;
}

interface OverviewStat {
  accent: string;
  icon: string;
  label: string;
  suffix: string;
  target: number;
  title: string;
}

const HERO_STATS: HeroStat[] = [
  { value: "3×", label: "Wins", color: "#00ff41" },
  { value: "2×", label: "National", color: "#7c3aed" },
  { value: "1×", label: "Global", color: "#ff003c" },
  { value: "8.0", label: "CGPA", color: "#f59e0b" },
];

const OVERVIEW_STATS: OverviewStat[] = [
  {
    icon: "🏆",
    target: 3,
    suffix: "× Wins",
    label: "Internal Competitions",
    title: "Hackathon Wins",
    accent: "#f59e0b",
  },
  {
    icon: "⚑",
    target: 2,
    suffix: "× Finals",
    label: "National Level",
    title: "National Finals",
    accent: "#7c3aed",
  },
  {
    icon: "◎",
    target: 1,
    suffix: "× Finalist",
    label: "Global Competition",
    title: "International",
    accent: "#00bfff",
  },
  {
    icon: "▣",
    target: 8,
    suffix: "/ 10",
    label: "UEM Jaipur · CSE",
    title: "CGPA",
    accent: "#00ff41",
  },
];

const TECH_STACK = [
  "Next.js",
  "Node.js",
  "TypeScript",
  "Docker",
  "FastAPI",
  "PostgreSQL",
  "OpenAI",
];

const TICKER_ITEMS = [
  "MERN",
  "Next.js",
  "TypeScript",
  "Docker",
  "FastAPI",
  "PostgreSQL",
  "Redis",
  "OpenAI API",
  "Prisma ORM",
  "JWT",
  "RBAC",
];

function useUniverseMotion(rootRef: RefObject<HTMLElement>): void {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .from(".hero-badge", { y: 20, opacity: 0, duration: 0.7 })
        .from(".hero-name", { y: 30, opacity: 0, duration: 0.8 }, "-=0.4")
        .from(".hero-role", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".hero-bio", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".hero-stats", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".hero-ctas", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(
          ".hero-frame",
          { scale: 0.96, opacity: 0, duration: 1.2 },
          "-=0.5"
        );

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

function useRotatingRole(): string {
  const [role, setRole] = useState("Full Stack Developer");

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRole((currentRole) =>
        currentRole === "Full Stack Developer" ? "Bug Debugger" : "Full Stack Developer"
      );
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, []);

  return role;
}

function useCoordinates(): string {
  const [coordinates, setCoordinates] = useState("[X: 23.4°] [Y: -8.2°] [Z: 142.7°]");

  useEffect(() => {
    const updateCoordinates = () => {
      const x = 18 + Math.random() * 14;
      const y = -12 + Math.random() * 9;
      const z = 128 + Math.random() * 26;
      setCoordinates(`[X: ${x.toFixed(1)}°] [Y: ${y.toFixed(1)}°] [Z: ${z.toFixed(1)}°]`);
    };

    const intervalId = window.setInterval(updateCoordinates, 2000);
    return () => window.clearInterval(intervalId);
  }, []);

  return coordinates;
}

function useScrollIndicator(): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY <= 100);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return isVisible;
}

function useSectionEntered(ref: RefObject<HTMLElement>): boolean {
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const section = ref.current;
    if (!section || hasEntered) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [hasEntered, ref]);

  return hasEntered;
}

function OverviewStatCard({
  isActive,
  stat,
}: {
  isActive: boolean;
  stat: OverviewStat;
}): JSX.Element {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isActive) return undefined;

    let animationFrame = 0;
    const duration = 1500;
    const start = performance.now();

    const animate = (time: number) => {
      const progress = Math.min(1, (time - start) / duration);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setValue(stat.target * easedProgress);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        setValue(stat.target);
      }
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [isActive, stat.target]);

  const displayValue = stat.title === "CGPA" ? value.toFixed(1) : Math.round(value).toString();

  return (
    <article className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(8,8,20,0.7)] p-6 text-left backdrop-blur-2xl">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-[100px] w-[100px] rounded-full blur-[40px]"
        style={{ backgroundColor: stat.accent, opacity: 0.15 }}
        aria-hidden="true"
      />
      <div className="relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#333]">
            {stat.title}
          </span>
          <span className="text-2xl" style={{ color: stat.accent }} aria-hidden="true">
            {stat.icon}
          </span>
        </div>
        <div className="flex items-end gap-2">
          <strong
            className="font-display text-[64px] font-black leading-none tracking-[-0.04em]"
            style={{ color: stat.accent }}
          >
            {displayValue}
          </strong>
          <span className="pb-2 font-mono text-[13px] text-[#555]">{stat.suffix}</span>
        </div>
        <p className="mt-3 font-sans text-xs text-[#333]">{stat.label}</p>
      </div>
    </article>
  );
}

function AtmosphereLayers(): JSX.Element {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="universe-noise absolute inset-0 opacity-[0.03]" />
      <div className="atmosphere-orb atmosphere-orb-green" />
      <div className="atmosphere-orb atmosphere-orb-purple" />
      <div className="atmosphere-orb atmosphere-orb-blue" />
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
  const overviewRef = useRef<HTMLElement>(null);
  const role = useRotatingRole();
  const coordinates = useCoordinates();
  const showScrollIndicator = useScrollIndicator();
  const overviewEntered = useSectionEntered(overviewRef);
  useUniverseMotion(rootRef);

  return (
    <main ref={rootRef} className="relative z-10 min-h-screen overflow-x-hidden pb-28">
      <AtmosphereLayers />

      <section className="relative min-h-screen overflow-hidden pt-20">
        <div className="hero-grid-texture pointer-events-none absolute inset-0 z-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-[1200px] items-center gap-12 px-6 py-16 md:grid-cols-[52fr_48fr] md:px-12">
          <div className="min-w-0">
            <div className="hero-badge mb-8 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/[0.04] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-green">
                <span
                  className="h-2 w-2 animate-pulse rounded-full bg-green shadow-[0_0_10px_rgba(0,255,65,0.8)]"
                  aria-hidden="true"
                />
                Open to Work
              </span>
              <span className="h-3.5 w-px bg-white/[0.08]" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#444]">
                Jaipur, India
              </span>
            </div>

            <h1 className="hero-name mb-5 font-display text-[clamp(44px,5.8vw,80px)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-[#e8e8f0]">
              <span className="block">Ashish Kumar</span>
              <span className="block">
                Jha<span className="text-green">.</span>
              </span>
            </h1>

            <p
              key={role}
              className="hero-role hero-role-glitch mb-7 font-mono text-base text-[rgba(232,232,240,0.45)]"
            >
              {role}
            </p>

            <p className="hero-bio mb-10 max-w-[440px] font-sans text-sm leading-[1.85] text-muted">
              I build production-grade systems with MERN, Next.js, TypeScript,
              FastAPI, Docker, and OpenAI. Currently targeting SWE roles.
            </p>

            <div className="hero-stats mb-11 grid grid-cols-2 gap-y-6 md:flex md:gap-0">
              {HERO_STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className={[
                    "md:border-r md:border-white/[0.06] md:px-7",
                    index === 0 ? "md:pl-0" : "",
                    index === HERO_STATS.length - 1 ? "md:border-r-0 md:pr-0" : "",
                  ].join(" ")}
                >
                  <p
                    className="font-display text-4xl font-black leading-none"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#444]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {windowActionsEnabled ? (
              <div className="hero-ctas flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onOpenApp("projects")}
                  className="rounded-lg border-0 bg-green px-7 py-[13px] font-mono text-xs font-bold uppercase tracking-[0.06em] text-background transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,255,65,0.28)]"
                >
                  Open projects →
                </button>
                <button
                  type="button"
                  onClick={() => onOpenApp("terminal")}
                  className="rounded-lg border border-green/25 bg-transparent px-7 py-[13px] font-mono text-xs uppercase tracking-[0.06em] text-green transition duration-200 hover:border-green/40 hover:bg-green/[0.06]"
                >
                  &gt;_ Launch terminal
                </button>
              </div>
            ) : (
              <div className="hero-ctas flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="rounded-lg border-0 bg-green px-7 py-[13px] font-mono text-xs font-bold uppercase tracking-[0.06em] text-background transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,255,65,0.28)]"
                >
                  Open projects →
                </a>
                <a
                  href="#terminal"
                  className="rounded-lg border border-green/25 bg-transparent px-7 py-[13px] font-mono text-xs uppercase tracking-[0.06em] text-green transition duration-200 hover:border-green/40 hover:bg-green/[0.06]"
                >
                  &gt;_ Launch terminal
                </a>
              </div>
            )}

            <div className="mt-9">
              <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.15em] text-[#333]">
                Tech Stack
              </p>
              <div className="flex max-w-[520px] flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[10px] text-[#2a2a3a]">
                {TECH_STACK.map((tech, index) => (
                  <span key={tech} className="transition hover:text-[#555]">
                    {tech}
                    {index < TECH_STACK.length - 1 ? (
                      <span className="ml-2 text-[#1f1f2e]">·</span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-frame relative hidden h-[580px] overflow-hidden rounded-[20px] border border-white/[0.05] bg-[rgba(5,5,16,0.6)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_40px_80px_rgba(0,0,0,0.5)] md:block">
            <HeroScene />
            <div className="pointer-events-none absolute right-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-[rgba(8,8,20,0.62)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#888] backdrop-blur-xl">
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-red shadow-[0_0_10px_rgba(255,0,60,0.8)]"
                aria-hidden="true"
              />
              LIVE SYSTEM
            </div>
            <div className="pointer-events-none absolute bottom-5 left-5 z-20 font-mono text-[9px] text-green/30">
              {coordinates}
            </div>
            <div className="pointer-events-none absolute bottom-5 right-5 z-20 font-mono text-[9px] text-[#333]">
              AshishOS / universe.three
            </div>
          </div>
        </div>

        <div
          className={[
            "hero-scroll-indicator absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-300 md:flex",
            showScrollIndicator ? "opacity-100" : "opacity-0",
          ].join(" ")}
          aria-hidden="true"
        >
          <span className="h-10 w-px bg-gradient-to-b from-transparent to-green" />
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#333]">
            Scroll
          </span>
        </div>
      </section>

      <section
        ref={overviewRef}
        data-universe-scene
        className="relative flex min-h-screen flex-col justify-center overflow-hidden py-24"
      >
        <div className="mx-auto w-full max-w-[1200px] px-6 text-center md:px-12">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#333]">
            System Overview
          </p>
          <h2 className="mx-auto max-w-3xl font-display text-[clamp(44px,6vw,64px)] font-black leading-[0.95] tracking-[-0.04em] text-[#e8e8f0]">
            The numbers
            <span className="block text-green">don&apos;t lie.</span>
          </h2>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OVERVIEW_STATS.map((stat) => (
              <OverviewStatCard key={stat.title} stat={stat} isActive={overviewEntered} />
            ))}
          </div>
        </div>

        <div className="mt-16 overflow-hidden border-y border-green/[0.08] bg-green/[0.04] py-3">
          <div className="system-ticker-track flex w-max items-center gap-4 font-mono text-[11px] text-[#555]">
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map(
              (item, index) => (
                <span key={`${item}-${index}`} className="whitespace-nowrap">
                  {item} <span className="text-[#333]">·</span>
                </span>
              )
            )}
          </div>
        </div>
      </section>

      <EngineerStory />

      <ProjectShowcase />

      <section data-universe-scene>
        <SkillsApp />
      </section>

      <section data-universe-scene>
        <AchievementsApp />
      </section>

      <section
        data-universe-scene
        className="mx-auto grid min-h-[80vh] w-full max-w-[1200px] items-center gap-6 px-6 py-20 md:grid-cols-2 md:px-12"
      >
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

      <footer className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-4 border-t border-glass px-6 py-8 font-mono text-xs text-text/50 md:px-12">
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
