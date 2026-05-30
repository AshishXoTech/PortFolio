"use client";

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
import { Taskbar } from "@/components/os/Taskbar";
import { WindowManager } from "@/components/os/WindowManager";
import { Scene } from "@/components/three/Scene";
import { useIsMobile } from "@/hooks/useMediaQuery";
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

export function Desktop(): JSX.Element {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-20 pt-8">
        <header className="border-b border-glass px-4 pb-4">
          <h1 className="font-mono text-xl text-green">AshishOS</h1>
          <p className="text-sm text-muted">Mobile view — scroll to explore apps</p>
        </header>
        <main className="space-y-4 p-4">
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
    <div className="relative h-screen overflow-hidden bg-background">
      <Scene />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.12)_0%,_transparent_55%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 grid h-[calc(100vh-48px)] grid-cols-[repeat(auto-fill,minmax(96px,1fr))] auto-rows-min gap-4 p-6 content-start">
        {DESKTOP_APPS.map((app) => (
          <AppIcon
            key={app.id}
            appId={app.id}
            label={app.label}
            icon={app.icon}
          />
        ))}
      </div>

      <Taskbar />
    </div>
  );
}
