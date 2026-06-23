"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";

interface AchievementEntry {
  color: string;
  description: string;
  effort: string;
  icon: string;
  side: "left" | "right";
  tier: string;
  title: string;
  year: string;
}

interface CounterItem {
  color: string;
  label: string;
  suffix?: string;
  target: number;
}

interface Star {
  color: string;
  delay: string;
  duration: string;
  left: string;
  opacity: number;
  top: string;
}

const ACHIEVEMENTS: AchievementEntry[] = [
  {
    side: "right",
    tier: "Internal Win",
    color: "#f59e0b",
    icon: "🏆",
    year: "2024",
    title: "Internal Hackathon Winner — 1st Place",
    description:
      "Built an AI-powered developer productivity tool against 100+ student teams.",
    effort: "48h · 100+ teams · First place",
  },
  {
    side: "left",
    tier: "Internal Win",
    color: "#f59e0b",
    icon: "🥇",
    year: "2025",
    title: "Internal Hackathon Winner — Fraud Detection",
    description:
      "Shipped a full-stack real-time fraud detection prototype in 36 hours.",
    effort: "36h · 100+ teams · First place",
  },
  {
    side: "right",
    tier: "Internal Win",
    color: "#f59e0b",
    icon: "🏆",
    year: "2025",
    title: "Internal Hackathon Winner — HackFlow AI",
    description:
      "Led team victory with HackFlow AI — an intelligent hackathon management platform.",
    effort: "48h · 100+ teams · First place",
  },
  {
    side: "left",
    tier: "National Finalist",
    color: "#7c3aed",
    icon: "🏅",
    year: "2025",
    title: "National Hackathon Finalist",
    description:
      "Reached national finals with Rakshak Fraud Platform — competing against 500+ teams.",
    effort: "National stage · 500+ teams · Top 10",
  },
  {
    side: "right",
    tier: "National Finalist",
    color: "#7c3aed",
    icon: "🏅",
    year: "2025",
    title: "National Hackathon Finalist",
    description:
      "Reached national finals with AI Credit Risk Advisor, recognized for AI integration depth.",
    effort: "National stage · 500+ teams · Top 10",
  },
  {
    side: "left",
    tier: "International",
    color: "#ff003c",
    icon: "🌐",
    year: "2025",
    title: "International Hackathon Finalist",
    description:
      "Competed globally with an AI-powered full-stack platform as a first-year B.Tech student.",
    effort: "Global stage · First-year · Top teams worldwide",
  },
];

const COUNTERS: CounterItem[] = [
  { target: 3, label: "Hackathon Wins", color: "#f59e0b" },
  { target: 100, label: "Teams Beaten", color: "#00ff41", suffix: "+" },
  { target: 2, label: "National Finals", color: "#7c3aed" },
  { target: 1, label: "Global Stage", color: "#ff003c" },
];

const STAR_COLORS = ["#f59e0b", "#7c3aed", "#ffffff"];

const STARS: Star[] = Array.from({ length: 200 }, (_, index) => {
  const x = (index * 37) % 101;
  const y = (index * 61) % 101;
  return {
    color: STAR_COLORS[index % STAR_COLORS.length],
    delay: `${(index % 13) * -0.31}s`,
    duration: `${2 + (index % 5)}s`,
    left: `${x}%`,
    opacity: 0.2 + ((index % 5) * 0.1),
    top: `${y}%`,
  };
});

gsap.registerPlugin(ScrollTrigger);

function useHallOfFameAnimation(rootRef: RefObject<HTMLElement>): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-achievement-card]")
    );

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        const side = card.dataset.side;
        gsap.fromTo(
          card,
          { x: side === "left" ? -60 : 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}

function useCounterTrigger(ref: RefObject<HTMLDivElement>): boolean {
  const [shouldRun, setShouldRun] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target || shouldRun) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldRun(true);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [ref, shouldRun]);

  return shouldRun;
}

function AnimatedCounter({
  color,
  label,
  shouldRun,
  suffix = "",
  target,
}: CounterItem & { shouldRun: boolean }): JSX.Element {
  const [value, setValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!shouldRun) return undefined;

    const duration = 2000;
    const startedAt = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * easedProgress));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setValue(target);
        setIsComplete(true);
        window.setTimeout(() => setIsComplete(false), 650);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [shouldRun, target]);

  return (
    <div className="text-center">
      <p
        className={[
          "font-display text-[clamp(52px,7vw,80px)] font-black leading-none tabular-nums",
          isComplete ? "achievement-counter-pulse" : "",
        ].join(" ")}
        style={{ color }}
      >
        {value}
        {suffix}
      </p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[#444]">
        {label}
      </p>
    </div>
  );
}

export function AchievementsApp(): JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const countersRef = useRef<HTMLDivElement>(null);
  const shouldRunCounters = useCounterTrigger(countersRef);
  useHallOfFameAnimation(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="achievements-hall relative overflow-hidden px-6 py-16 md:px-12"
      aria-label="Achievements hall of fame"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {STARS.map((star, index) => (
          <span
            key={`achievement-star-${index}`}
            className="achievement-star"
            style={{
              animationDelay: star.delay,
              animationDuration: star.duration,
              backgroundColor: star.color,
              left: star.left,
              opacity: star.opacity,
              top: star.top,
            }}
          />
        ))}
        <span className="absolute right-6 top-12 text-[160px] opacity-10 md:text-[200px]">
          🏆
        </span>
        <span className="absolute bottom-20 left-4 text-[160px] opacity-10 md:text-[200px]">
          🥇
        </span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px]">
        <header className="mb-10 max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
            06 / Wins
          </p>
          <h2 className="mt-3 font-display text-[clamp(48px,7vw,72px)] font-black leading-[0.9] tracking-[-0.04em] text-[#e8e8f0]">
            Built under
            <span className="block text-gold">pressure.</span>
          </h2>
          <p className="mt-3 font-sans text-[15px] italic leading-7 text-muted">
            Every win started with a bug at 2am and a deadline at 9am.
          </p>
        </header>

        <div
          ref={countersRef}
          className="mb-10 grid gap-8 rounded-2xl border border-white/[0.05] bg-[rgba(8,8,20,0.6)] px-6 py-7 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4 lg:px-10"
        >
          {COUNTERS.map((counter) => (
            <AnimatedCounter
              key={counter.label}
              {...counter}
              shouldRun={shouldRunCounters}
            />
          ))}
        </div>

        <div className="achievements-timeline relative mx-auto">
          {ACHIEVEMENTS.map((achievement) => (
            <div
              key={`${achievement.year}-${achievement.title}-${achievement.side}`}
              className="relative mb-8 grid md:grid-cols-2 md:gap-16"
            >
              <div
                className="achievement-center-dot"
                style={
                  {
                    "--achievement-color": achievement.color,
                    borderColor: achievement.color,
                  } as CSSProperties & { "--achievement-color": string }
                }
                aria-hidden="true"
              >
                <span>{achievement.icon}</span>
              </div>

              {achievement.side === "left" ? (
                <AchievementCard achievement={achievement} />
              ) : (
                <div className="hidden md:block" />
              )}

              {achievement.side === "right" ? (
                <AchievementCard achievement={achievement} />
              ) : (
                <div className="hidden md:block" />
              )}
            </div>
          ))}
        </div>

        <blockquote className="relative mt-10 border-y border-gold/[0.08] bg-gold/[0.04] px-6 py-8 text-center md:px-12">
          <span
            className="pointer-events-none absolute left-8 top-0 font-display text-7xl text-gold/20"
            aria-hidden="true"
          >
            “
          </span>
          <p className="font-sans text-lg italic text-[rgba(232,232,240,0.5)]">
            The bugs, the 2am sessions, the 100+ teams — every single one was
            worth it.
          </p>
          <footer className="mt-4 font-mono text-[11px] text-[#444]">
            — Ashish Kumar Jha, Pre-Final year B.Tech CSE
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

function AchievementCard({
  achievement,
}: {
  achievement: AchievementEntry;
}): JSX.Element {
  return (
    <article
      data-achievement-card
      data-side={achievement.side}
      className={[
        "relative w-full overflow-hidden rounded-2xl border border-white/[0.055] bg-[rgba(6,6,16,0.85)] px-7 py-6 opacity-0",
        achievement.side === "left" ? "md:justify-self-end" : "md:justify-self-start",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-[120px] w-[120px] rounded-full opacity-15 blur-[50px]"
        style={{ backgroundColor: achievement.color }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <span
          className="rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{
            backgroundColor: `${achievement.color}1a`,
            color: achievement.color,
          }}
        >
          {achievement.tier}
        </span>
        <span className="font-mono text-[10px] text-[#444]">{achievement.year}</span>
      </div>
      <h3 className="relative z-10 mt-4 font-display text-xl font-extrabold text-[#e8e8f0]">
        {achievement.title}
      </h3>
      <p className="relative z-10 mt-3 font-sans text-[13px] leading-[1.75] text-[#555]">
        {achievement.description}
      </p>
      <div className="relative z-10 mt-5">
        <span className="inline-flex rounded-full border border-white/[0.06] px-3 py-1 font-mono text-[10px] text-[#444]">
          {achievement.effort}
        </span>
      </div>
    </article>
  );
}
