"use client";

import { useEffect, useRef, useState } from "react";

type SceneId = "blank" | "bug" | "commit" | "win" | "mission";

interface StoryScene {
  accent: string;
  id: SceneId;
  label: string;
  metric: string;
  title: string;
  subtitle: string;
}

const STORY_SCENES: StoryScene[] = [
  {
    id: "blank",
    accent: "#00ff41",
    label: "Day 1",
    metric: "00:00",
    title: "The blank file stares back.",
    subtitle:
      "No error message. No warning. Just possibility and absolute terror.",
  },
  {
    id: "bug",
    accent: "#ff003c",
    label: "Every night",
    metric: "02:47",
    title: "Line 47. Again.",
    subtitle:
      "Stack Overflow has 4 answers. None of them work. Chai cup is empty.",
  },
  {
    id: "commit",
    accent: "#f59e0b",
    label: "3:14 AM",
    metric: "a3f2b1c",
    title: "It finally works.",
    subtitle: "No idea why. Not touching it. Committing and sleeping.",
  },
  {
    id: "win",
    accent: "#f59e0b",
    label: "Hackathon Season",
    metric: "Rank #1",
    title: "Rank 1. Three times.",
    subtitle: "100+ teams. 48 hours. The bugs were worth it.",
  },
  {
    id: "mission",
    accent: "#7c3aed",
    label: "Right now",
    metric: "SWE next",
    title: "Not done yet.",
    subtitle: "Java. DSA. System Design. The SWE role is the next commit.",
  },
];

const MISSION_PROGRESS = [
  { label: "Java", value: 45 },
  { label: "DSA", value: 50 },
  { label: "System Design", value: 40 },
] as const;

const ERROR_LINES = [
  "TypeError: Cannot read properties of undefined",
  "at Object.<anonymous> (/app/server.js:47:12)",
  "Stack trace:",
  "at Router.handle (/app/node_modules/router.js:132:9)",
  "at async main (/app/server.js:88:5)",
] as const;

function EditorShell({
  children,
  filename,
  footer,
}: {
  children: React.ReactNode;
  filename: string;
  footer?: string;
}): JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0a0a14] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="relative flex h-[38px] items-center border-b border-white/[0.05] px-4">
        <div className="flex gap-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <p className="absolute left-1/2 -translate-x-1/2 font-mono text-[11px] text-[#6a6a8a]">
          {filename}
        </p>
      </div>
      <div className="min-h-[260px] p-4 font-mono text-[13px] leading-[1.8]">
        {children}
      </div>
      {footer ? (
        <div className="border-t border-white/[0.05] px-4 py-2 font-mono text-[10px] text-[#444]">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

function BlankFileVisual(): JSX.Element {
  return (
    <EditorShell filename="index.js" footer="0 lines | UTF-8">
      <div className="flex items-center gap-3 text-[#303045]">
        <span>1</span>
        <span className="h-5 w-[2px] animate-pulse bg-[#00ff41]" />
      </div>
    </EditorShell>
  );
}

function BugVisual(): JSX.Element {
  return (
    <div className="relative">
      <div className="absolute right-4 top-4 z-10 rounded border border-red/20 bg-red/[0.08] px-3 py-1 font-mono text-[11px] text-red">
        2:47 AM
      </div>
      <EditorShell filename="terminal">
        <div className="space-y-2 pt-8 text-red">
          {Array.from({ length: 10 }, (_, index) => (
            <p
              key={`bug-line-${index}`}
              className="day-story-error"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {ERROR_LINES[index % ERROR_LINES.length]}
            </p>
          ))}
        </div>
      </EditorShell>
    </div>
  );
}

function CommitVisual(): JSX.Element {
  const lines = [
    "git add .",
    "git commit -m 'feat: it finally works'",
    "1 file changed, 47 insertions(+), 3 deletions(-)",
    "[main a3f2b1c] feat: it finally works",
    "BUILD SUCCESSFUL in 2.3s",
  ];

  return (
    <EditorShell filename="git-bash">
      <div className="space-y-3 text-[#00ff41]">
        {lines.map((line, index) => (
          <p
            key={line}
            className={index === lines.length - 1 ? "font-bold glow-green" : ""}
          >
            {line}
          </p>
        ))}
      </div>
    </EditorShell>
  );
}

function WinVisual(): JSX.Element {
  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(8,8,20,0.82)] p-5 backdrop-blur-[20px]">
      <div className="mb-5 flex items-center justify-between">
        <div className="text-[40px] drop-shadow-[0_0_18px_rgba(245,158,11,0.65)]">
          🏆
        </div>
        <div className="font-display text-5xl font-black text-[#f59e0b]">
          3x
        </div>
      </div>
      <div className="space-y-3 font-mono text-[12px]">
        <div className="rounded-lg border border-green/25 bg-green/[0.08] p-3 text-green">
          RANK #1 — Team AshishXoTech — HackFlow AI — 94.2 pts
        </div>
        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 text-[#555]">
          RANK #2 — another team — 87.1 pts
        </div>
        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 text-[#555]">
          RANK #3 — another team — 82.4 pts
        </div>
      </div>
    </div>
  );
}

function MissionVisual(): JSX.Element {
  return (
    <div className="grid gap-4">
      <EditorShell filename="DSA.java">
        <pre className="text-[#6a6a8a]">
{`int binarySearch(int[] a, int target) {
  int l = 0, r = a.length - 1;
  while (l <= r) {
    int mid = l + (r - l) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return -1;
}`}
        </pre>
      </EditorShell>
      <div className="grid gap-3 rounded-xl border border-purple/15 bg-purple/[0.04] p-4">
        {MISSION_PROGRESS.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between font-mono text-[10px] text-[#6a6a8a]">
              <span>{item.label}</span>
              <span>{item.value}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded bg-white/[0.06]">
              <div
                className="day-story-progress h-full rounded bg-purple"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SceneVisual({ id }: { id: SceneId }): JSX.Element {
  switch (id) {
    case "blank":
      return <BlankFileVisual />;
    case "bug":
      return <BugVisual />;
    case "commit":
      return <CommitVisual />;
    case "win":
      return <WinVisual />;
    case "mission":
      return <MissionVisual />;
    default: {
      const exhaustive: never = id;
      return exhaustive;
    }
  }
}

function SceneExtra({ id }: { id: SceneId }): JSX.Element {
  if (id === "blank") {
    return (
      <p className="day-story-type mt-7 w-fit font-mono text-sm text-green">
        $ npx create-next-app
      </p>
    );
  }

  if (id === "bug") {
    return (
      <p className="mt-7 font-mono text-sm text-red">
        npm run dev --<span className="animate-pulse">|</span>
      </p>
    );
  }

  if (id === "commit") {
    return (
      <p className="day-story-type mt-7 w-fit font-mono text-sm text-[#f59e0b]">
        commit a3f2b1c
      </p>
    );
  }

  if (id === "win") {
    return (
      <div className="mt-7 flex flex-wrap gap-2">
        <span className="rounded-full border border-purple/30 bg-purple/10 px-3 py-1 font-mono text-[10px] text-purple">
          2x National Finalist
        </span>
        <span className="rounded-full border border-red/30 bg-red/10 px-3 py-1 font-mono text-[10px] text-red">
          1x International Finalist
        </span>
      </div>
    );
  }

  return (
    <div className="mt-7 h-2 max-w-sm overflow-hidden rounded bg-white/[0.06]">
      <div className="day-story-progress h-full rounded bg-purple" style={{ width: "72%" }} />
    </div>
  );
}

export function EngineerStory(): JSX.Element {
  const [activeScene, setActiveScene] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(0);
  const activeAccent = STORY_SCENES[activeScene]?.accent ?? "#00ff41";
  const activeStory = STORY_SCENES[activeScene] ?? STORY_SCENES[0];

  useEffect(() => {
    if (isPaused) return undefined;

    timerRef.current = window.setInterval(() => {
      setActiveScene((current) => (current + 1) % STORY_SCENES.length);
    }, 4200);

    return () => {
      window.clearInterval(timerRef.current);
      timerRef.current = 0;
    };
  }, [isPaused]);

  return (
    <section
      className="relative overflow-hidden py-14"
      aria-label="A day in the life"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,255,65,0.08),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(124,58,237,0.1),transparent_34%)]" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 md:px-12">
        <div className="mb-8 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-green">
            Scene 03 / Engineer Story
          </p>
          <h2 className="mt-2 font-display text-4xl font-black leading-tight text-[#e8e8f0] md:text-6xl">
            A day in the life, without the drama filter.
          </h2>
          <p className="mt-4 font-sans text-base leading-7 text-[#6a6a8a]">
            A realistic loop: blank files, ugly errors, tiny breakthroughs,
            hackathon pressure, and the fundamentals I am building now.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="glass rounded-2xl p-3">
            {STORY_SCENES.map((scene, index) => {
              const isActive = index === activeScene;

              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setActiveScene(index)}
                  className={[
                    "group mb-2 grid w-full grid-cols-[32px_1fr_auto] items-center gap-3 rounded-xl border p-3 text-left transition last:mb-0",
                    isActive
                      ? "border-white/10 bg-white/[0.04]"
                      : "border-transparent hover:border-white/5 hover:bg-white/[0.025]",
                  ].join(" ")}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg border font-mono text-[10px]"
                    style={{
                      borderColor: isActive ? scene.accent : "rgba(255,255,255,0.08)",
                      color: isActive ? scene.accent : "#555",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span
                      className="block font-mono text-[10px] uppercase tracking-[0.12em]"
                      style={{ color: isActive ? scene.accent : "#444" }}
                    >
                      {scene.label}
                    </span>
                    <span className="mt-1 block truncate font-display text-sm font-bold text-[#e8e8f0]">
                      {scene.title}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] text-[#444]">
                    {scene.metric}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="glass overflow-hidden rounded-3xl border-white/[0.07]">
            <div className="grid gap-0 lg:grid-cols-[48fr_52fr]">
              <div className="relative min-h-[420px] border-b border-white/[0.06] p-5 lg:border-b-0 lg:border-r">
                <div
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    background: `radial-gradient(circle at 50% 40%, ${activeAccent}33, transparent 55%)`,
                  }}
                />
                <div key={`visual-${activeStory.id}`} className="relative z-10 animate-[fadeIn_0.35s_ease-out]">
                  <SceneVisual id={activeStory.id} />
                </div>
              </div>

              <div className="flex min-h-[420px] flex-col justify-center p-7 md:p-10">
                <p
                  className="mb-5 font-mono text-[11px] uppercase tracking-[0.12em]"
                  style={{ color: activeStory.accent }}
                >
                  {activeStory.label}
                </p>
                <h3
                  key={`title-${activeStory.id}`}
                  className="mb-5 font-display text-[clamp(34px,4vw,60px)] font-black leading-none text-[#e8e8f0]"
                >
                  {activeStory.title}
                </h3>
                <p className="max-w-[440px] font-sans text-base leading-[1.8] text-[#6a6a8a]">
                  {activeStory.subtitle}
                </p>
                <SceneExtra id={activeStory.id} />

                <div className="mt-10">
                  <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-[#444]">
                    <span>{String(activeScene + 1).padStart(2, "0")} / 05</span>
                    <span>{isPaused ? "Paused" : "Auto playing"}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded bg-white/[0.06]">
                    <div
                      key={activeScene}
                      className="story-autoplay-progress h-full rounded"
                      style={{ backgroundColor: activeAccent }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
