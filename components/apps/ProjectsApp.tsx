"use client";

import {
  motion,
  type PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { projects } from "@/lib/data/projects";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

const CARD_WIDTH = 400;
const CARD_HEIGHT = 460;
const AUTO_ADVANCE_MS = 5000;
const SWIPE_THRESHOLD = 50;

type BadgeVariant = "green" | "purple" | "red";

const BADGE_STYLES: Record<BadgeVariant, string> = {
  green: "border-[#00ff41] text-[#00ff41]",
  purple: "border-[#7c3aed] text-[#7c3aed]",
  red: "border-[#ff003c] text-[#ff003c]",
};

function getWrappedOffset(
  index: number,
  activeIndex: number,
  length: number
): number {
  let offset = index - activeIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

function getCardTransform(offset: number): {
  x: number;
  rotateY: number;
  z: number;
  scale: number;
  opacity: number;
  zIndex: number;
} {
  if (offset === 0) {
    return { x: 0, rotateY: 0, z: 0, scale: 1, opacity: 1, zIndex: 30 };
  }

  const sign = offset > 0 ? 1 : -1;
  return {
    x: sign * 260,
    rotateY: sign * -25,
    z: -80,
    scale: 0.85,
    opacity: 0.5,
    zIndex: 20 - Math.abs(offset),
  };
}

interface ProjectCardProps {
  project: Project;
  index: number;
  offset: number;
}

function ProjectCard({ project, index, offset }: ProjectCardProps): JSX.Element {
  const transform = getCardTransform(offset);
  const numberLabel = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      animate={{
        x: transform.x,
        rotateY: transform.rotateY,
        z: transform.z,
        scale: transform.scale,
        opacity: transform.opacity,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        zIndex: transform.zIndex,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="flex h-full flex-col rounded-2xl border border-[rgba(255,255,255,0.08)] p-7"
        style={{ background: "rgba(12, 12, 12, 0.95)" }}
      >
        <span className="font-mono text-[11px] text-[#888888]">{numberLabel}</span>

        <h2 className="mt-2 font-sans text-[22px] font-bold text-[#e0e0e0]">
          {project.title}
        </h2>
        <p className="mt-1 font-sans text-[13px] text-[#888888]">
          {project.tagline}
        </p>

        <div
          className="my-4 h-px w-full bg-[rgba(255,255,255,0.06)]"
          aria-hidden="true"
        />

        <p className="flex-1 font-sans text-[13px] leading-[1.7] text-[#aaaaaa]">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((tech, techIndex) => {
            const variant: BadgeVariant =
              techIndex % 3 === 0
                ? "green"
                : techIndex % 3 === 1
                  ? "purple"
                  : "red";

            return (
              <span
                key={tech}
                className={cn(
                  "rounded border px-2 py-0.5 font-mono text-[10px]",
                  BADGE_STYLES[variant]
                )}
              >
                {tech}
              </span>
            );
          })}
        </div>

        <div className="mt-5 flex gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-[rgba(255,255,255,0.35)] px-3.5 py-1.5 font-mono text-[11px] text-[#e0e0e0] transition-colors hover:border-white hover:bg-white hover:text-[#0a0a0a]"
            >
              GitHub
            </a>
          )}
          <a
            href={project.live ?? project.github ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "rounded-md px-3.5 py-1.5 font-mono text-[11px] font-medium transition-opacity",
              project.live || project.github
                ? "bg-[#00ff41] text-[#0a0a0a] hover:brightness-110"
                : "pointer-events-none bg-[#00ff41]/40 text-[#0a0a0a]/60"
            )}
            aria-disabled={!project.live && !project.github}
          >
            Live Demo
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export function ProjectsApp(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-120, 0, 120], [0.6, 1, 0.6]);

  const goTo = useCallback((index: number) => {
    const length = projects.length;
    setActiveIndex(((index % length) + length) % length);
  }, []);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (isHovered) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % projects.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [isHovered, activeIndex]);

  const handleDragEnd = (_: unknown, info: PanInfo): void => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      goNext();
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      goPrev();
    }
    dragX.set(0);
  };

  return (
    <div
      className="relative bg-[#0a0a0a] p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative mx-auto flex items-center justify-center"
        style={{
          height: CARD_HEIGHT + 80,
          maxWidth: "100%",
          perspective: 1400,
        }}
      >
        <motion.div
          className="relative h-full w-full"
          style={{ opacity: dragOpacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDrag={(_, info) => dragX.set(info.offset.x)}
          onDragEnd={handleDragEnd}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              offset={getWrappedOffset(index, activeIndex, projects.length)}
            />
          ))}
        </motion.div>

        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous project"
          className="absolute left-2 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(12,12,12,0.75)] text-[#e0e0e0] backdrop-blur-md transition-colors hover:border-[#00ff41]/40 hover:text-[#00ff41]"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next project"
          className="absolute right-2 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(12,12,12,0.75)] text-[#e0e0e0] backdrop-blur-md transition-colors hover:border-[#00ff41]/40 hover:text-[#00ff41]"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-2 flex justify-center gap-2">
        {projects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to ${project.title}`}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              index === activeIndex
                ? "w-6 bg-[#00ff41] shadow-[0_0_8px_#00ff41]"
                : "bg-[#333333] hover:bg-[#555555]"
            )}
          />
        ))}
      </div>
    </div>
  );
}
