"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";

interface AchievementItem {
  color: string;
  description: string;
  icon: string;
  title: string;
  year: string;
}

interface CounterItem {
  color: string;
  label: string;
  suffix?: string;
  target: number;
}

const ACHIEVEMENTS: AchievementItem[] = [
  {
    icon: "🏅",
    color: "#00ff41",
    title: "3x Internal Hackathon Winner",
    year: "2024-25",
    description:
      "Beat 100+ student teams across 3 consecutive college hackathons building full-stack and AI solutions.",
  },
  {
    icon: "🥈",
    color: "#7c3aed",
    title: "2x National Hackathon Finalist",
    year: "2025",
    description:
      "Reached national finals with AI-integrated full-stack platforms, recognized among top teams across India.",
  },
  {
    icon: "🌐",
    color: "#ff003c",
    title: "1x International Hackathon Finalist",
    year: "2025",
    description:
      "Competed against global teams with an AI-powered full-stack platform as a first-year student.",
  },
];

const COUNTERS: CounterItem[] = [
  { target: 3, label: "Hackathon Wins", color: "#00ff41" },
  { target: 100, label: "Students Beaten", color: "#7c3aed", suffix: "+" },
  { target: 2, label: "National Finals", color: "#ff003c" },
  { target: 1, label: "International", color: "#f59e0b" },
];

gsap.registerPlugin(ScrollTrigger);

function useTimelineAnimation(): RefObject<HTMLDivElement> {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return undefined;

    const cards = Array.from(
      timeline.querySelectorAll<HTMLElement>("[data-achievement-card]")
    );

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            delay: index * 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
            },
          }
        );
      });
    }, timeline);

    return () => {
      ctx.revert();
    };
  }, []);

  return timelineRef;
}

function useCounterTrigger(): [RefObject<HTMLDivElement>, boolean] {
  const countersRef = useRef<HTMLDivElement>(null);
  const [shouldRun, setShouldRun] = useState(false);

  useEffect(() => {
    const counters = countersRef.current;
    if (!counters) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;

        setShouldRun(true);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(counters);

    return () => {
      observer.disconnect();
    };
  }, []);

  return [countersRef, shouldRun];
}

function AnimatedCounter({
  color,
  label,
  shouldRun,
  suffix = "",
  target,
}: CounterItem & { shouldRun: boolean }): JSX.Element {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!shouldRun) return undefined;

    const duration = 1500;
    const startedAt = window.performance.now();
    let frameId = 0;

    const tick = (now: number): void => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const easedProgress = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * easedProgress));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [shouldRun, target]);

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(8,8,20,0.72)] p-5 backdrop-blur-[20px]">
      <p
        className="font-display text-[clamp(48px,6vw,72px)] font-black leading-none"
        style={{ color }}
      >
        {value}
        {suffix}
      </p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[#444]">
        {label}
      </p>
    </div>
  );
}

export function AchievementsApp(): JSX.Element {
  const timelineRef = useTimelineAnimation();
  const [countersRef, shouldRunCounters] = useCounterTrigger();
  const pulseStyles = useMemo(
    () =>
      ACHIEVEMENTS.map(
        (achievement, index) => `
          @keyframes achievement-pulse-${index} {
            0%, 100% { box-shadow: 0 0 0 0 ${achievement.color}66; }
            70% { box-shadow: 0 0 0 8px transparent; }
          }
        `
      ).join("\n"),
    []
  );

  return (
    <div className="grid gap-6 p-1 md:grid-cols-[55fr_45fr]">
      <style>{pulseStyles}</style>

      <div ref={timelineRef} className="relative pl-7">
        <div
          className="absolute bottom-2 left-[9px] top-2 w-[2px] bg-gradient-to-b from-[#00ff41] via-[#7c3aed] to-transparent"
          aria-hidden="true"
        />

        <div className="space-y-5">
          {ACHIEVEMENTS.map((achievement, index) => (
            <div key={achievement.title} className="relative">
              <div
                className="absolute -left-[27px] top-5 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-[#050510]"
                style={{
                  animation: `achievement-pulse-${index} 2.5s ease infinite`,
                  borderColor: achievement.color,
                }}
                aria-hidden="true"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: achievement.color }}
                />
              </div>

              <article
                data-achievement-card
                className="rounded-r-xl border-l-[3px] bg-[rgba(8,8,20,0.8)] px-6 py-5 opacity-0"
                style={{ borderLeftColor: achievement.color }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-[22px]" aria-hidden="true">
                    {achievement.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-[17px] font-bold text-[#e8e8f0]">
                        {achievement.title}
                      </h3>
                      <span className="shrink-0 font-mono text-[10px] text-[#444]">
                        {achievement.year}
                      </span>
                    </div>
                    <p className="mt-3 font-sans text-[13px] leading-[1.75] text-[#555]">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      <div ref={countersRef} className="grid content-start gap-4 sm:grid-cols-2">
        {COUNTERS.map((counter) => (
          <AnimatedCounter
            key={counter.label}
            {...counter}
            shouldRun={shouldRunCounters}
          />
        ))}
      </div>
    </div>
  );
}
