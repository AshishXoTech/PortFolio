"use client";

import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  ChevronDown,
  FolderKanban,
  Mail,
  Terminal,
  Trophy,
  User,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EngineerUniverse } from "@/components/os/EngineerUniverse";
import { Taskbar } from "@/components/os/Taskbar";
import { WindowManager } from "@/components/os/WindowManager";
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

const NAV_MESSAGES: Record<AppId, string> = {
  about: "Loading profile...",
  achievements: "Loading wins...",
  blog: "Parsing posts...",
  contact: "Opening channel...",
  projects: "Fetching builds...",
  skills: "Reading stack...",
  terminal: "Spawning shell...",
};

const NAV_TARGETS: Record<AppId, string> = {
  about: "home",
  achievements: "achievements",
  blog: "blog",
  contact: "contact",
  projects: "projects",
  skills: "skills",
  terminal: "terminal",
};

export function Desktop(): JSX.Element {
  const isMobile = useIsMobile();
  const { activeWindowId, openApp, windows } = useOS();
  const activeAppId =
    windows.find((window) => window.id === activeWindowId)?.appId ?? null;

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
      <FloatingOSNav activeAppId={activeAppId} onOpenApp={openApp} />

      <EngineerUniverse onOpenApp={openApp} />
      <Taskbar />
    </div>
  );
}

function FloatingOSNav({
  activeAppId,
  onOpenApp,
}: {
  activeAppId: AppId | null;
  onOpenApp: (appId: AppId) => void;
}): JSX.Element {
  const navRef = useRef<HTMLElement>(null);
  const tooltipTimeoutRef = useRef<number | null>(null);
  const [activeSection, setActiveSection] = useState<AppId>(activeAppId ?? "about");
  const [clickedItem, setClickedItem] = useState<AppId | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [magneticOffset, setMagneticOffset] = useState(0);
  const [time, setTime] = useState("");
  const visibleMobileItems: AppId[] = ["about", "projects", "terminal", "contact"];

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          hour12: false,
          minute: "2-digit",
        }).format(new Date())
      );
    };

    updateTime();
    const intervalId = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const updateScrolled = () => setIsScrolled(window.scrollY > 100);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  useEffect(() => {
    const sectionIds = ["home", "projects", "skills", "terminal", "achievements", "blog", "contact"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const sectionId = visible?.target.id;
        if (!sectionId) return;

        const match = DESKTOP_APPS.find((app) => NAV_TARGETS[app.id] === sectionId);
        if (match) setActiveSection(match.id);
      },
      { threshold: [0.4, 0.6] }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let current = 0;
    let target = 0;
    let frameId = 0;

    const animate = () => {
      current += (target - current) * 0.16;
      setMagneticOffset(current);
      frameId = window.requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const nav = navRef.current;
      if (!nav) return;
      const rect = nav.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy);
      target = distance < 80 ? Math.max(-20, Math.min(20, dx)) * 0.1 : 0;
    };

    frameId = window.requestAnimationFrame(animate);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.cancelAnimationFrame(frameId);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleNavClick = (appId: AppId) => {
    setActiveSection(appId);
    setClickedItem(appId);
    setIsMobileMenuOpen(false);

    if (tooltipTimeoutRef.current) window.clearTimeout(tooltipTimeoutRef.current);
    tooltipTimeoutRef.current = window.setTimeout(() => setClickedItem(null), 1200);

    const targetId = NAV_TARGETS[appId];
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    onOpenApp(appId);
  };

  return (
    <nav
      ref={navRef}
      className={[
        "fixed left-1/2 top-5 z-[1000] max-w-[calc(100vw-16px)] rounded-[60px] border bg-[rgba(5,5,16,0.82)] px-1.5 py-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[28px] backdrop-saturate-[180%] transition-all duration-300",
        isScrolled
          ? "border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(0,255,65,0.04),inset_0_1px_0_rgba(255,255,255,0.04)]"
          : "border-white/[0.07]",
      ].join(" ")}
      style={{ transform: `translateX(calc(-50% + ${magneticOffset}px))` }}
      aria-label="AshishOS navigation"
    >
      <div className="flex items-center gap-0.5">
        <div className="mr-1.5 hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-green/15 bg-green/[0.08] font-mono text-[11px] text-green md:flex">
          &gt;
        </div>

        {DESKTOP_APPS.map((app) => {
          const isMobileVisible = visibleMobileItems.includes(app.id);
          return (
            <NavButton
              key={app.id}
              app={app}
              isActive={activeSection === app.id}
              isClicked={clickedItem === app.id}
              isMobileVisible={isMobileVisible}
              onClick={() => handleNavClick(app.id)}
              tooltip={clickedItem === app.id ? NAV_MESSAGES[app.id] : null}
            />
          );
        })}

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="ml-1 flex rounded-full px-2.5 py-1.5 font-mono text-[10px] text-text/50 transition hover:bg-white/[0.04] hover:text-text md:hidden"
          aria-label="Open navigation menu"
        >
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="mx-1.5 hidden h-4 w-px bg-white/[0.08] md:block" />
        <div className="hidden items-center gap-1.5 rounded-full border border-green/[0.08] bg-green/[0.04] px-3 py-1.5 md:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green shadow-[0_0_8px_rgba(0,255,65,0.8)]" />
          <span className="font-mono text-[10px] text-green/60">Live</span>
        </div>
        <span className="ml-1 hidden font-mono text-[10px] text-[#333] lg:inline">
          {time}
        </span>
      </div>

      {isMobileMenuOpen ? (
        <div className="absolute left-1/2 top-[calc(100%+10px)] w-[220px] -translate-x-1/2 rounded-2xl border border-white/[0.07] bg-[rgba(5,5,16,0.92)] p-2 backdrop-blur-[24px] md:hidden">
          {DESKTOP_APPS.map((app) => (
            <button
              key={`mobile-${app.id}`}
              type="button"
              onClick={() => handleNavClick(app.id)}
              className="block w-full rounded-xl px-5 py-3 text-left font-mono text-[11px] text-text/55 transition hover:bg-white/[0.04] hover:text-green"
            >
              {app.label}
            </button>
          ))}
        </div>
      ) : null}
    </nav>
  );
}

function NavButton({
  app,
  isActive,
  isClicked,
  isMobileVisible,
  onClick,
  tooltip,
}: {
  app: DesktopApp;
  isActive: boolean;
  isClicked: boolean;
  isMobileVisible: boolean;
  onClick: () => void;
  tooltip: string | null;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative shrink-0 rounded-full border-0 px-4 py-[7px] font-mono text-[11px] tracking-[0.04em] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isMobileVisible ? "" : "hidden md:block",
        "max-md:px-2.5 max-md:py-1.5 max-md:text-[10px]",
        isActive
          ? "bg-green/10 text-green shadow-[0_0_0_1px_rgba(0,255,65,0.2)]"
          : "bg-transparent text-text/35 hover:bg-white/[0.04] hover:text-text/75",
        isClicked ? "scale-95" : "scale-100",
      ].join(" ")}
    >
      {app.label}
      {isActive ? (
        <span className="absolute bottom-[3px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-green shadow-[0_0_4px_#00ff41]" />
      ) : null}
      {tooltip ? (
        <span className="nav-click-tooltip absolute left-1/2 top-[calc(100%+10px)] z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-green/15 bg-green/[0.08] px-2.5 py-1 font-mono text-[10px] text-green">
          {tooltip}
        </span>
      ) : null}
    </button>
  );
}
