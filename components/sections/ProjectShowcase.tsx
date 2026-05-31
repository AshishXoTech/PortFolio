"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, MouseEvent } from "react";

interface ProjectShowcaseItem {
  accent: string;
  accentRgb: string;
  architecture: ArchitectureLayer[];
  description: [string, string, string];
  githubUrl: string;
  liveUrl?: string;
  name: string;
  number: string;
  stack: string[];
  tagline: string;
}

interface ArchitectureLayer {
  color: string;
  label: string;
}

const PROJECTS: ProjectShowcaseItem[] = [
  {
    number: "01",
    name: "HackFlow AI",
    tagline: "AI-powered hackathon evaluation platform",
    accent: "#00ff41",
    accentRgb: "0, 255, 65",
    githubUrl: "https://github.com/AshishXoTech",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "FastAPI", "JWT"],
    architecture: [
      { label: "Frontend", color: "#00ff41" },
      { label: "Backend", color: "#7c3aed" },
      { label: "Database", color: "#ff003c" },
      { label: "AI", color: "#00bfff" },
    ],
    description: [
      "Python FastAPI ML pipeline auto-evaluates GitHub repos with NLP scoring",
      "3-tier role system (organizer / judge / participant) with JWT auth",
      "Real-time leaderboards replace manual judging entirely",
    ],
  },
  {
    number: "02",
    name: "Rakshak",
    tagline: "Fraud detection with AI risk scoring",
    accent: "#ff003c",
    accentRgb: "255, 0, 60",
    githubUrl: "https://github.com/AshishXoTech",
    stack: [
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "RBAC",
      "OpenAI",
      "Docker",
      "Redis",
    ],
    architecture: [
      { label: "Backend", color: "#7c3aed" },
      { label: "Database", color: "#ff003c" },
      { label: "AI", color: "#00bfff" },
      { label: "Cache", color: "#f59e0b" },
    ],
    description: [
      "OpenAI scores every fraud complaint 0-100 with plain-English reasoning",
      "3-tier RBAC (user / analyst / admin) with JWT-secured Express APIs",
      "Redis caching + Dockerized services for predictable deployment",
    ],
  },
  {
    number: "03",
    name: "AI Credit Advisor",
    tagline: "Explainable credit-risk guidance",
    accent: "#7c3aed",
    accentRgb: "124, 58, 237",
    githubUrl: "https://github.com/AshishXoTech",
    stack: ["React.js", "Node.js", "OpenAI API", "Recharts", "Tailwind CSS"],
    architecture: [
      { label: "Frontend", color: "#00ff41" },
      { label: "Backend", color: "#7c3aed" },
      { label: "AI", color: "#00bfff" },
      { label: "Charts", color: "#f59e0b" },
    ],
    description: [
      "Cashflow and debt-to-income metrics drive the 0-100 risk score",
      "OpenAI converts financial signals into recommendations users understand",
      "Recharts dashboards make trends visible — not buried in numbers",
    ],
  },
];

const CODE_RAIN_COLUMNS = Array.from({ length: 20 }, (_, index) => ({
  id: `code-rain-${index}`,
  left: `${(index / 19) * 100}%`,
  delay: `${(index % 7) * -1.3}s`,
  duration: `${8 + (index % 8)}s`,
  chars: ["{", "}", "0", "1", "=>", "fn", "if", "api", "jwt", "sql", "&&", "</>"],
}));

export function ProjectShowcase(): JSX.Element {
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;

    const cards = grid.querySelectorAll<HTMLElement>("[data-project-showcase-card]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.24 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      const rect = section.getBoundingClientRect();
      section.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      section.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    section.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleCardMouseMove = (event: MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1200px) translateY(-8px) scale(1.01) rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
  };

  const handleCardMouseLeave = (event: MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    card.style.transform = "perspective(1000px) rotateX(0deg) translateY(0)";
  };

  return (
    <section
      ref={sectionRef}
      className="project-showcase-section relative min-h-screen overflow-hidden px-6 py-28 md:px-12"
      aria-label="Project showcase"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="project-mouse-spot absolute inset-0" />
        {CODE_RAIN_COLUMNS.map((column) => (
          <div
            key={column.id}
            className="project-code-rain-column"
            style={{
              animationDelay: column.delay,
              animationDuration: column.duration,
              left: column.left,
            }}
          >
            <div className="flex flex-col gap-5">
              {column.chars.map((char, index) => (
                <span key={`${column.id}-${char}-${index}`}>{char}</span>
              ))}
            </div>
          </div>
        ))}
        <div className="absolute left-[10%] top-[20%] h-[300px] w-[300px] rounded-full bg-green/[0.04] blur-[80px]" />
        <div className="absolute left-[40%] top-[30%] h-[350px] w-[350px] rounded-full bg-red/[0.04] blur-[90px]" />
        <div className="absolute right-[8%] top-[20%] h-[300px] w-[300px] rounded-full bg-purple/[0.05] blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px]">
        <div className="mb-20 max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#333]">
            04 / Shipped Products
          </p>
          <h2 className="mt-5 font-display text-[clamp(48px,7vw,72px)] font-black leading-[0.9] tracking-[-0.04em] text-[#e8e8f0]">
            Things I
            <span className="block text-green">actually built.</span>
          </h2>
          <p className="mt-3 font-sans text-[15px] leading-7 text-muted">
            Three production-grade systems. Real stack. Real architecture.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid gap-5 lg:grid-cols-3"
          style={{ perspective: "1200px" }}
        >
          {PROJECTS.map((project, index) => (
            <article
              key={project.name}
              data-project-showcase-card
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="project-showcase-card group relative flex min-h-[520px] cursor-default flex-col overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.055)] bg-[rgba(6,6,16,0.85)] p-8"
              style={
                {
                  "--project-accent": project.accent,
                  "--project-accent-rgb": project.accentRgb,
                  "--project-delay": `${index * 0.12}s`,
                } as CSSProperties & {
                  "--project-accent": string;
                  "--project-accent-rgb": string;
                  "--project-delay": string;
                }
              }
            >
              <div className="project-card-top-glow" aria-hidden="true" />
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-20 blur-[70px] transition-opacity duration-500 group-hover:opacity-35"
                style={{ backgroundColor: project.accent }}
                aria-hidden="true"
              />

              <div className="relative z-10 mb-6 flex items-start justify-between gap-4">
                <span className="inline-flex items-center font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--project-accent)]">
                  <span
                    className="mr-2 h-1 w-1"
                    style={{ backgroundColor: project.accent }}
                    aria-hidden="true"
                  />
                  {project.number}
                </span>
                <div className="flex flex-wrap justify-end gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[#555]">
                    <span className="h-1.5 w-1.5 rounded-full bg-green" aria-hidden="true" />
                    Deployed
                  </span>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-white/[0.08] px-2.5 py-1 font-mono text-[10px] text-[#444] transition hover:border-white/25 hover:text-[#e0e0e0]"
                  >
                    ↗ GitHub
                  </a>
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="font-display text-[28px] font-black leading-tight tracking-[-0.02em] text-[#e8e8f0]">
                  {project.name}
                </h3>
                <p className="mt-1 font-mono text-[11px]" style={{ color: project.accent }}>
                  {project.tagline}
                </p>

                <div className="mb-5 mt-5 h-px bg-white/[0.04]" />

                <div className="space-y-2">
                  {project.description.map((bullet) => (
                    <div key={bullet} className="flex gap-3 font-sans text-[13px] leading-[1.75] text-[#6a6a8a]">
                      <span
                        className="mt-2 h-1 w-1 shrink-0"
                        style={{ backgroundColor: project.accent }}
                        aria-hidden="true"
                      />
                      <p>{bullet}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded px-2.5 py-1 font-mono text-[10px]"
                      style={{
                        backgroundColor: `rgba(${project.accentRgb}, 0.06)`,
                        border: `1px solid rgba(${project.accentRgb}, 0.25)`,
                        color: project.accent,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-auto flex items-center justify-between gap-4 pt-8">
                <div className="flex items-center gap-2" aria-label={`${project.name} architecture layers`}>
                  {project.architecture.map((layer) => (
                    <span
                      key={layer.label}
                      title={layer.label}
                      className="h-2 w-2 rounded-full shadow-[0_0_14px_currentColor]"
                      style={{ backgroundColor: layer.color, color: layer.color }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-white/[0.12] px-[18px] py-2 font-mono text-[11px] text-[#888] transition hover:border-white/30 hover:text-[#e0e0e0]"
                  >
                    GitHub
                  </a>
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md px-[18px] py-2 font-mono text-[11px] font-bold text-background transition hover:brightness-110"
                      style={{
                        backgroundColor: project.accent,
                        boxShadow: `0 0 20px rgba(${project.accentRgb}, 0.18)`,
                      }}
                    >
                      Live
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="rounded-md px-[18px] py-2 font-mono text-[11px] font-bold text-background transition disabled:cursor-not-allowed disabled:opacity-70"
                      style={{
                        backgroundColor: project.accent,
                        boxShadow: `0 0 20px rgba(${project.accentRgb}, 0.18)`,
                      }}
                    >
                      Live
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
