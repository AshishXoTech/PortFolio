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
import { EngineerUniverse } from "@/components/os/EngineerUniverse";
import { Taskbar } from "@/components/os/Taskbar";
import { WindowManager } from "@/components/os/WindowManager";
import { Scene } from "@/components/three/Scene";
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

export function Desktop(): JSX.Element {
  const isMobile = useIsMobile();
  const { openApp } = useOS();

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
      <Scene className="fixed" />

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
