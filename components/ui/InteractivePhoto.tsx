"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function InteractivePhoto(): JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const currentRotateX = useRef(0);
  const currentRotateY = useRef(0);
  const targetRotateX = useRef(0);
  const targetRotateY = useRef(0);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const handleMouseMove = (e: MouseEvent): void => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      targetRotateY.current =
        ((e.clientX - centerX) / (window.innerWidth / 2)) * 18;
      targetRotateX.current =
        -((e.clientY - centerY) / (window.innerHeight / 2)) * 12;

      if (shineRef.current) {
        const shineX = ((e.clientX - rect.left) / rect.width) * 100;
        const shineY = ((e.clientY - rect.top) / rect.height) * 100;
        shineRef.current.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
      }
    };

    const lerpLoop = (): void => {
      currentRotateX.current +=
        (targetRotateX.current - currentRotateX.current) * 0.09;
      currentRotateY.current +=
        (targetRotateY.current - currentRotateY.current) * 0.09;

      if (cardRef.current) {
        cardRef.current.style.transform = `rotateX(${currentRotateX.current}deg) rotateY(${currentRotateY.current}deg)`;
      }

      animFrameRef.current = requestAnimationFrame(lerpLoop);
    };

    animFrameRef.current = requestAnimationFrame(lerpLoop);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="interactive-photo-root">
      {/* Floating code tags */}
      <span className="ip-float-tag ip-float-tag-1">
        {"const dev = new Ashish()"}
      </span>
      <span className="ip-float-tag ip-float-tag-2">
        {"git push origin main"}
      </span>
      <span className="ip-float-tag ip-float-tag-3">
        {"npm run build ✓"}
      </span>

      {/* Perspective wrapper */}
      <div className="ip-perspective">
        {/* Tilt card */}
        <div
          ref={cardRef}
          className="ip-card"
        >
          {/* Layer 1 — Depth shadow card (behind) */}
          <div className="ip-depth ip-depth-1" aria-hidden="true" />

          {/* Layer 2 — Second depth card (further behind) */}
          <div className="ip-depth ip-depth-2" aria-hidden="true" />

          {/* Layer 3 — Main photo */}
          <div className="ip-photo-wrap">
            <div className="ip-photo-border" aria-hidden="true" />
            <Image
              src="/images/avatar.jpg"
              alt="Ashish Kumar Jha"
              width={360}
              height={440}
              sizes="(min-width: 768px) 360px, 240px"
              className="ip-photo-img"
              draggable={false}
              priority
            />
            {/* Scan line */}
            <span className="ip-scan" aria-hidden="true" />
          </div>

          {/* Layer 4 — Shine overlay */}
          <div
            ref={shineRef}
            className="ip-shine"
            aria-hidden="true"
          />

          {/* Layer 5 — Top edge highlight */}
          <div className="ip-top-edge" aria-hidden="true" />

          {/* Corner HUD brackets */}
          <span className="ip-corner ip-corner-tl" aria-hidden="true" />
          <span className="ip-corner ip-corner-tr" aria-hidden="true" />
          <span className="ip-corner ip-corner-bl" aria-hidden="true" />
          <span className="ip-corner ip-corner-br" aria-hidden="true" />

          {/* Online badge */}
          <span className="ip-status" aria-hidden="true">
            ● ONLINE
          </span>

          {/* Username tag */}
          <span className="ip-tag">ashish@portfolio ~</span>
        </div>
      </div>
    </div>
  );
}
