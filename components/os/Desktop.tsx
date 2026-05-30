"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FolderKanban,
  Mail,
  Terminal,
  Trophy,
  User,
  Wrench,
} from "lucide-react";
import { AppIcon } from "@/components/os/AppIcon";
import { EngineerUniverse } from "@/components/os/EngineerUniverse";
import { Taskbar } from "@/components/os/Taskbar";
import { WindowManager } from "@/components/os/WindowManager";
import HeroScene from "@/components/three/HeroScene";
import { BokehOrbs } from "@/components/ui/BokehOrbs";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useOS } from "@/hooks/useOS";
import type { AppId } from "@/types/os";

interface DesktopApp {
  id: AppId;
  label: string;
  icon: LucideIcon;
}

const DESKTOP_APPS: DesktopApp[] = [
  { id: "about", label: "About", icon: User },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "terminal", label: "Terminal", icon: Terminal },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "blog", label: "Blog", icon: BookOpen },
  { id: "contact", label: "Contact", icon: Mail },
];

interface HeroPointerOffset {
  x: number;
  y: number;
}

export function Desktop(): JSX.Element {
  const isMobile = useIsMobile();
  const { openApp } = useOS();
  const frameRef = useRef(0);
  const pointerRef = useRef<HeroPointerOffset>({ x: 0, y: 0 });
  const [bokehOffset, setBokehOffset] = useState<HeroPointerOffset>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (isMobile) {
      setBokehOffset({ x: 0, y: 0 });
      return undefined;
    }

    const updateOffset = (): void => {
      frameRef.current = 0;
      setBokehOffset({
        x: pointerRef.current.x * 12,
        y: pointerRef.current.y * 8,
      });
    };

    const handleMouseMove = (event: MouseEvent): void => {
      pointerRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };

      if (frameRef.current === 0) {
        frameRef.current = window.requestAnimationFrame(updateOffset);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      if (frameRef.current !== 0) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <EngineerUniverse onOpenApp={openApp} windowActionsEnabled={false} />
        <main className="relative z-10 space-y-4 p-4">
          {DESKTOP_APPS.map((app) => (
            <section
              key={app.id}
              id={app.id}
              className="rounded-lg border border-glass bg-glass p-4 backdrop-blur-glass"
            >
              <div className="mb-3 flex items-center gap-2">
                <app.icon className="h-5 w-5 text-green" />
                <h2 className="font-mono text-sm text-text">{app.label}</h2>
              </div>
              <WindowManager mobileAppId={app.id} />
            </section>
          ))}
        </main>
        <Taskbar />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 z-0">
        <BokehOrbs offsetX={bokehOffset.x} offsetY={bokehOffset.y} />
        <HeroScene />
      </div>

      <div className="fixed left-4 top-4 z-30 grid grid-cols-1 gap-3">
        {DESKTOP_APPS.map((app) => (
          <AppIcon
            key={app.id}
            appId={app.id}
            label={app.label}
            icon={app.icon}
          />
        ))}
      </div>

      <EngineerUniverse onOpenApp={openApp} />
      <Taskbar />
    </div>
  );
}
