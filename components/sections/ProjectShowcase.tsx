"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

interface ProjectShowcaseItem {
  accent: string;
  accentRgb: string;
  description: [string, string, string];
  githubUrl: string;
  liveUrl?: string;
  name: string;
  number: string;
  stack: string[];
  tagline: string;
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
    description: [
      "AI-powered hackathon platform with auto-evaluation of GitHub repos.",
      "Microservices: Node REST API and Python FastAPI ML pipeline in parallel.",
      "Real-time leaderboards and role-based access for judges and participants.",
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
    description: [
      "Enterprise fraud detection with 3-tier RBAC (user/analyst/admin).",
      "OpenAI scores each complaint 0-100 with plain-English explanations.",
      "Fully Dockerized deployment with Redis caching layer.",
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
    description: [
      "Credit risk scoring engine using cashflow and debt-to-income metrics.",
      "OpenAI delivers plain-English financial advisory recommendations.",
      "Interactive Recharts dashboards visualize risk trends over time.",
    ],
  },
];

export function ProjectShowcase(): JSX.Element {
  const gridRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="min-h-screen py-20" aria-label="Project showcase">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-green">
          Scene 04 / Projects
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold text-text md:text-6xl">
          Cards flip up like shipped artifacts.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-text/70 md:text-lg">
          Three full-stack builds showing product thinking, backend depth, and
          practical AI integration.
        </p>
      </div>

      <div
        ref={gridRef}
        className="mt-10 grid gap-5 md:grid-cols-3"
        style={{ perspective: "1200px" }}
      >
        {PROJECTS.map((project, index) => (
          <article
            key={project.name}
            data-project-showcase-card
            className="project-showcase-card relative overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.07)] bg-[rgba(8,8,20,0.75)] p-8 backdrop-blur-[24px]"
            style={
              {
                "--project-accent-rgb": project.accentRgb,
                transitionDelay: `${index * 0.15}s`,
              } as CSSProperties & {
                "--project-accent-rgb": string;
              }
            }
          >
            <div className="relative z-10 flex items-start justify-between gap-4">
              <span className="font-mono text-[10px] text-[#444]">
                {project.number}
              </span>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded border border-white/10 px-2 py-1 font-mono text-[10px] text-text/70 transition hover:border-white/35 hover:text-text"
              >
                GitHub
              </a>
            </div>

            <div className="relative z-10 mt-8">
              <h3 className="font-display text-[22px] font-extrabold text-[#e8e8f0]">
                {project.name}
              </h3>
              <p
                className="mt-2 font-mono text-[11px]"
                style={{ color: project.accent }}
              >
                {project.tagline}
              </p>

              <div className="my-4 h-px bg-[rgba(255,255,255,0.05)]" />

              <div className="space-y-3 font-sans text-[13px] leading-[1.8] text-[#6a6a8a]">
                {project.description.map((sentence) => (
                  <p key={sentence}>{sentence}</p>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded border px-2 py-1 font-mono text-[10px]"
                    style={{
                      backgroundColor: `rgba(${project.accentRgb}, 0.08)`,
                      borderColor: `rgba(${project.accentRgb}, 0.3)`,
                      color: project.accent,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border border-white/40 px-4 py-2 font-display text-xs font-bold text-text transition hover:bg-white hover:text-background"
                >
                  GitHub
                </a>
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded px-4 py-2 font-display text-xs font-bold text-background transition hover:brightness-110"
                    style={{ backgroundColor: project.accent }}
                  >
                    Live
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="rounded px-4 py-2 font-display text-xs font-bold text-background opacity-60"
                    style={{ backgroundColor: project.accent }}
                  >
                    Live
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
