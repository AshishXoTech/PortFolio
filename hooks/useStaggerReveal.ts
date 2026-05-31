"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function useStaggerReveal(): React.RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const children = element.querySelectorAll<HTMLElement>("[data-reveal]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 78%",
          },
        }
      );
    }, element);

    return () => {
      ctx.revert();
    };
  }, []);

  return ref;
}
