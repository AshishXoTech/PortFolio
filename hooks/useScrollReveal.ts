"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

type FromDirection = "bottom" | "left" | "right";

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(
  from: FromDirection = "bottom",
  delay = 0
): React.RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const fromVars: Record<FromDirection, gsap.TweenVars> = {
      bottom: { y: 40, opacity: 0 },
      left: { x: -40, opacity: 0 },
      right: { x: 40, opacity: 0 },
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(element, fromVars[from], {
        y: 0,
        x: 0,
        opacity: 1,
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
    }, element);

    return () => {
      ctx.revert();
    };
  }, [delay, from]);

  return ref;
}
