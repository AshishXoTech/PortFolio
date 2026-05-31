"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";

type BeatId = "beginning" | "bugs" | "breakthrough" | "mission";

interface StoryBeat {
  id: BeatId;
  eyebrow: string;
  title: string;
  subtitle: string;
}

const STORY_BEATS: StoryBeat[] = [
  {
    id: "beginning",
    eyebrow: "01 / The Beginning",
    title: "Before the first line",
    subtitle: "Empty file. Full doubt. Cursor waiting.",
  },
  {
    id: "bugs",
    eyebrow: "02 / The Bugs",
    title: "Bugs arrive at 3am",
    subtitle: "Stack traces, silence, one tiny undefined.",
  },
  {
    id: "breakthrough",
    eyebrow: "03 / The Breakthrough",
    title: "Then it ships",
    subtitle: "HackFlow. Rakshak. Wins became working systems.",
  },
  {
    id: "mission",
    eyebrow: "04 / The Mission",
    title: "Back to fundamentals",
    subtitle: "Java, DSA, system design, SWE next.",
  },
];

const PROGRESS_ITEMS = [
  { label: "Java", value: 45 },
  { label: "DSA", value: 50 },
  { label: "System Design", value: 40 },
] as const;

gsap.registerPlugin(ScrollTrigger);

function usePinnedStory(
  sectionRef: RefObject<HTMLElement>,
  beatRefs: RefObject<HTMLDivElement>[],
  isMobile: boolean
): void {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isMobile) return undefined;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=300%",
        pin: true,
        pinSpacing: true,
      });

      beatRefs.forEach((beatRef, index) => {
        const beat = beatRef.current;
        if (!beat) return;

        if (index === 0) {
          gsap.set(beat, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            beat,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              scrollTrigger: {
                trigger: section,
                start: `${index * 25}% top`,
                end: `${index * 25 + 8}% top`,
                scrub: 1,
              },
            }
          );
        }

        if (index < beatRefs.length - 1) {
          gsap.to(beat, {
            opacity: 0,
            y: -30,
            scrollTrigger: {
              trigger: section,
              start: `${(index + 1) * 25 - 5}% top`,
              end: `${(index + 1) * 25}% top`,
              scrub: 1,
            },
          });
        }
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [beatRefs, isMobile, sectionRef]);
}

function useMobileReveal(
  sectionRef: RefObject<HTMLElement>,
  isMobile: boolean
): boolean[] {
  const [visibleBeats, setVisibleBeats] = useState<boolean[]>(
    STORY_BEATS.map((_, index) => index === 0)
  );

  useEffect(() => {
    if (!isMobile) {
      setVisibleBeats(STORY_BEATS.map((_, index) => index === 0));
      return undefined;
    }

    const section = sectionRef.current;
    if (!section) return undefined;

    const nodes = section.querySelectorAll<HTMLElement>("[data-story-beat]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const indexValue = entry.target.getAttribute("data-story-index");
          if (!indexValue || !entry.isIntersecting) return;

          const index = Number(indexValue);
          if (!Number.isInteger(index)) return;

          setVisibleBeats((current) =>
            current.map((visible, currentIndex) =>
              currentIndex === index ? true : visible
            )
          );
        });
      },
      { threshold: 0.35 }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
    };
  }, [isMobile, sectionRef]);

  return visibleBeats;
}

function BeginningVisual(): JSX.Element {
  return (
    <div className="mt-10 font-mono text-sm text-green">
      <div className="inline-flex items-center gap-2 rounded border border-green/20 bg-green/[0.04] px-4 py-3">
        <span className="h-5 w-[2px] animate-pulse bg-green" aria-hidden="true" />
        <span className="engineer-story-float">npx create-next-app</span>
      </div>
    </div>
  );
}

function BugsVisual(): JSX.Element {
  return (
    <div className="mt-10 grid gap-2 overflow-hidden rounded border border-red/20 bg-red/[0.04] p-4 font-mono text-sm text-red">
      {Array.from({ length: 5 }, (_, index) => (
        <p
          key={`error-line-${index}`}
          className="engineer-story-error"
          style={{ animationDelay: `${index * 0.18}s` }}
        >
          TypeError: Cannot read properties of undefined
        </p>
      ))}
    </div>
  );
}

function BreakthroughVisual(): JSX.Element {
  return (
    <div className="relative mt-10 inline-flex items-center rounded border border-green/25 bg-green/[0.05] px-5 py-4 font-mono text-sm text-green shadow-[0_0_50px_rgba(0,255,65,0.12)]">
      <span>BUILD SUCCESSFUL</span>
      {Array.from({ length: 12 }, (_, index) => (
        <span
          key={`success-particle-${index}`}
          className="engineer-story-particle"
          style={{
            "--particle-angle": `${index * 30}deg`,
            animationDelay: `${index * 0.04}s`,
          } as CSSProperties & Record<"--particle-angle", string>}
        />
      ))}
    </div>
  );
}

function MissionVisual(): JSX.Element {
  return (
    <div className="mt-10 grid w-full max-w-md gap-5">
      {PROGRESS_ITEMS.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between font-mono text-xs">
            <span className="text-text/70">{item.label}</span>
            <span className="text-green">{item.value}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded bg-white/[0.06]">
            <div
              className="engineer-story-progress h-full rounded bg-green"
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function BeatVisual({ beatId }: { beatId: BeatId }): JSX.Element {
  switch (beatId) {
    case "beginning":
      return <BeginningVisual />;
    case "bugs":
      return <BugsVisual />;
    case "breakthrough":
      return <BreakthroughVisual />;
    case "mission":
      return <MissionVisual />;
    default: {
      const exhaustive: never = beatId;
      return exhaustive;
    }
  }
}

export function EngineerStory(): JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const beatOneRef = useRef<HTMLDivElement>(null);
  const beatTwoRef = useRef<HTMLDivElement>(null);
  const beatThreeRef = useRef<HTMLDivElement>(null);
  const beatFourRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const beatRefs = useMemo(
    () =>
      [
        beatOneRef,
        beatTwoRef,
        beatThreeRef,
        beatFourRef,
      ] satisfies RefObject<HTMLDivElement>[],
    []
  );

  usePinnedStory(sectionRef, beatRefs, isMobile);
  const visibleBeats = useMobileReveal(sectionRef, isMobile);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden py-16 md:h-screen md:py-0"
      aria-label="Engineer story"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,65,0.08),transparent_38%)]" />

      {STORY_BEATS.map((beat, index) => (
        <div
          key={beat.id}
          ref={beatRefs[index]}
          data-story-beat
          data-story-index={index}
          className={[
            "relative flex min-h-[76vh] flex-col items-center justify-center px-4 text-center md:absolute md:inset-0 md:min-h-0",
            isMobile
              ? visibleBeats[index]
                ? "translate-y-0 opacity-100 transition duration-700 ease-out"
                : "translate-y-8 opacity-0 transition duration-700 ease-out"
              : "",
          ].join(" ")}
          style={!isMobile ? { opacity: index === 0 ? 1 : 0 } : undefined}
        >
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-green">
            {beat.eyebrow}
          </p>
          <h2 className="mt-4 max-w-5xl font-display text-[clamp(48px,7vw,96px)] font-black leading-[0.98] text-[#e8e8f0]">
            {beat.title}
          </h2>
          <p className="mt-5 max-w-2xl font-sans text-[18px] leading-[1.8] text-[#6a6a8a]">
            {beat.subtitle}
          </p>
          <BeatVisual beatId={beat.id} />
        </div>
      ))}
    </section>
  );
}
