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
  Search,
  Home,
  FolderOpen,
  Cpu,
  Download,
  Copy,
  Github,
  Linkedin,
  Sun,
  List,
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

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "Overview" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Wins" },
  { id: "terminal", label: "Terminal" },
  { id: "contact", label: "Contact" },
];

export function Desktop(): JSX.Element {
  const isMobile = useIsMobile();
  const { activeWindowId, openApp, windows } = useOS();
  const activeAppId =
    windows.find((window) => window.id === activeWindowId)?.appId ?? null;

  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [gPressed, setGPressed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState("home");

  const triggerAccentFlash = (sectionId: string) => {
    const accentColors: Record<string, string> = {
      home: "#00ff41",
      about: "#00ff41",
      projects: "#00ff41",
      skills: "#7c3aed",
      achievements: "#f59e0b",
      terminal: "#00ff41",
      contact: "#7c3aed",
    };
    const color = accentColors[sectionId] || "#00ff41";
    
    const flash = document.createElement("div");
    flash.style.position = "fixed";
    flash.style.inset = "0";
    flash.style.zIndex = "9000";
    flash.style.backgroundColor = color;
    flash.style.opacity = "0";
    flash.style.pointerEvents = "none";
    flash.style.transition = "opacity 0.2s ease-out";
    
    document.body.appendChild(flash);
    
    requestAnimationFrame(() => {
      flash.style.opacity = "0.03";
      setTimeout(() => {
        flash.style.transition = "opacity 0.2s ease-in";
        flash.style.opacity = "0";
        setTimeout(() => {
          flash.remove();
        }, 200);
      }, 200);
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const elements = SECTIONS.map((sec) => document.getElementById(sec.id)).filter(Boolean) as HTMLElement[];
    
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        
        if (visible?.target.id) {
          setActiveSectionId(visible.target.id);
        }
      },
      { threshold: [0.3, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        if (e.key === "Escape" && showCommandPalette) {
          setShowCommandPalette(false);
        }
        return;
      }

      if (e.key === "Escape") {
        setShowShortcutsHelp(false);
        setShowCommandPalette(false);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
        setShowShortcutsHelp(false);
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setShowShortcutsHelp((prev) => !prev);
        setShowCommandPalette(false);
        return;
      }

      if (e.key.toLowerCase() === "g") {
        setGPressed(true);
        const timer = setTimeout(() => setGPressed(false), 1000);
        return () => clearTimeout(timer);
      }

      if (gPressed) {
        const key = e.key.toLowerCase();
        const targets: Record<string, string> = {
          h: "home",
          p: "projects",
          s: "skills",
          t: "terminal",
          a: "achievements",
          c: "contact",
        };

        if (targets[key]) {
          e.preventDefault();
          const element = document.getElementById(targets[key]);
          if (element) {
            triggerAccentFlash(targets[key]);
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          setGPressed(false);
        }
      }

      if (e.key.toLowerCase() === "t" && !gPressed) {
        e.preventDefault();
        openApp("terminal");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gPressed, showCommandPalette, openApp]);

  useEffect(() => {
    const handleToggleCmdPalette = () => {
      setShowCommandPalette((prev) => !prev);
      setShowShortcutsHelp(false);
    };
    const handleToggleShortcuts = () => {
      setShowShortcutsHelp((prev) => !prev);
      setShowCommandPalette(false);
    };

    window.addEventListener("toggle-command-palette", handleToggleCmdPalette);
    window.addEventListener("toggle-shortcuts-help", handleToggleShortcuts);

    return () => {
      window.removeEventListener("toggle-command-palette", handleToggleCmdPalette);
      window.removeEventListener("toggle-shortcuts-help", handleToggleShortcuts);
    };
  }, []);

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
      {/* Scroll Progress Indicator */}
      <div 
        className="fixed left-0 top-0 z-[99999] h-[2px] bg-gradient-to-r from-green to-purple transition-[width] duration-100 ease-out animate-pulse" 
        style={{ width: `${scrollProgress}%` }}
      />

      <FloatingOSNav activeAppId={activeAppId} onOpenApp={openApp} />

      <EngineerUniverse onOpenApp={openApp} />

      {/* Vertical Dot Indicator */}
      <div className="fixed right-6 top-1/2 z-[100] hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {SECTIONS.map((sec) => {
          const isActive = activeSectionId === sec.id;
          return (
            <button
              key={`dot-${sec.id}`}
              type="button"
              onClick={() => {
                const el = document.getElementById(sec.id);
                if (el) {
                  triggerAccentFlash(sec.id);
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="group relative flex items-center justify-end p-1.5 focus:outline-none cursor-pointer"
              aria-label={`Scroll to ${sec.label}`}
            >
              <span className="pointer-events-none absolute right-7 scale-95 font-mono text-[9px] uppercase tracking-wider text-[#888] opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 bg-[rgba(5,5,16,0.85)] border border-white/[0.05] px-2 py-0.5 rounded-full backdrop-blur-md">
                {sec.label}
              </span>
              <span
                className={[
                  "rounded-full transition-all duration-300",
                  isActive
                    ? "h-2 w-2 bg-green shadow-[0_0_8px_#00ff41]"
                    : "h-1 w-1 bg-white/15 group-hover:h-1.5 group-hover:w-1.5 group-hover:bg-white/40",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>

      <Taskbar />

      {/* Keyboard Shortcuts Help Modal */}
      <ShortcutsHelpModal 
        isOpen={showShortcutsHelp} 
        onClose={() => setShowShortcutsHelp(false)} 
      />

      {/* Command Palette Overlay */}
      <CommandPalette 
        isOpen={showCommandPalette} 
        onClose={() => setShowCommandPalette(false)} 
        openApp={openApp}
      />
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
  const [showChangelog, setShowChangelog] = useState(false);
  const visibleMobileItems: AppId[] = ["about", "projects", "terminal", "contact"];

  const triggerAccentFlash = (sectionId: string) => {
    const accentColors: Record<string, string> = {
      home: "#00ff41",
      about: "#00ff41",
      projects: "#00ff41",
      skills: "#7c3aed",
      achievements: "#f59e0b",
      terminal: "#00ff41",
      contact: "#7c3aed",
    };
    const color = accentColors[sectionId] || "#00ff41";
    
    const flash = document.createElement("div");
    flash.style.position = "fixed";
    flash.style.inset = "0";
    flash.style.zIndex = "9000";
    flash.style.backgroundColor = color;
    flash.style.opacity = "0";
    flash.style.pointerEvents = "none";
    flash.style.transition = "opacity 0.2s ease-out";
    
    document.body.appendChild(flash);
    
    requestAnimationFrame(() => {
      flash.style.opacity = "0.03";
      setTimeout(() => {
        flash.style.transition = "opacity 0.2s ease-in";
        flash.style.opacity = "0";
        setTimeout(() => {
          flash.remove();
        }, 200);
      }, 200);
    });
  };

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
      triggerAccentFlash(targetId);
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

        {/* Product Version Badge with dropdown changelog */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowChangelog((prev) => !prev);
            }}
            className="font-mono text-[9px] text-[#333] hover:text-[#555] transition px-1.5 py-0.5 cursor-pointer focus:outline-none"
          >
            v1.0.2
          </button>
          
          {showChangelog && (
            <>
              <div className="fixed inset-0 z-10 cursor-default" onClick={() => setShowChangelog(false)} />
              <div className="absolute top-[32px] right-0 z-20 w-[220px] rounded-xl border border-white/[0.07] bg-[rgba(5,5,16,0.95)] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.8)] text-left backdrop-blur-xl">
                <div className="mb-3 font-mono text-[9px] font-bold tracking-[0.15em] text-[#444] uppercase">
                  CHANGELOG
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="font-mono text-[10px] font-semibold text-[#666]">v1.0.2 — Jun 2025</div>
                    <div className="mt-1 font-sans text-xs text-[#555] leading-relaxed">
                      · Added 3D Earth background<br />
                      · Interactive photo tilt
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] font-semibold text-[#666]">v1.0.1 — May 2025</div>
                    <div className="mt-1 font-sans text-xs text-[#555] leading-relaxed">
                      · Boot sequence upgraded<br />
                      · Terminal easter eggs
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] font-semibold text-[#666]">v1.0.0 — Apr 2025</div>
                    <div className="mt-1 font-sans text-xs text-[#555] leading-relaxed">
                      · Initial launch
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
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

// ----------------------------------------------------
// Keyboard Shortcuts Help Modal
// ----------------------------------------------------
interface ShortcutsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ShortcutsHelpModal({ isOpen, onClose }: ShortcutsHelpModalProps): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[480px] rounded-2xl border border-white/[0.08] bg-[rgba(5,5,16,0.92)] p-7 shadow-[0_32px_80px_rgba(0,0,0,0.8)] backdrop-blur-[32px] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg font-bold text-[#e8e8f0]">Keyboard Shortcuts</h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="rounded px-2 py-1 font-mono text-[10px] text-[#444] hover:text-[#888] cursor-pointer"
          >
            ESC
          </button>
        </div>
        <p className="font-sans text-xs text-[#555] mb-6">Navigate AshishOS like a pro</p>

        <div className="space-y-4">
          <ShortcutRow keys="G then H" action="Go Home" />
          <ShortcutRow keys="G then P" action="Go to Projects" />
          <ShortcutRow keys="G then S" action="Go to Skills" />
          <ShortcutRow keys="G then T" action="Open Terminal" />
          <ShortcutRow keys="G then A" action="Go to Achievements" />
          <ShortcutRow keys="G then C" action="Go to Contact" />
          <ShortcutRow keys="T" action="Open Terminal window" />
          <ShortcutRow keys="?" action="Show this help" />
          <ShortcutRow keys="Escape" action="Close any modal" />
        </div>
      </div>
    </div>
  );
}

function ShortcutRow({ keys, action }: { keys: string; action: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.02] pb-2">
      <span className="font-sans text-xs text-[#666]">{action}</span>
      <span className="flex gap-1.5">
        {keys.split(" then ").map((key, i) => (
          <span key={i} className="flex items-center">
            {i > 0 && <span className="font-mono text-[9px] text-[#333] mr-1.5">then</span>}
            <kbd className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-[#e0e0e0] shadow-[0_2px_0_rgba(0,0,0,0.2)]">
              {key}
            </kbd>
          </span>
        ))}
      </span>
    </div>
  );
}

// ----------------------------------------------------
// Command Palette Modal
// ----------------------------------------------------
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  openApp: (appId: AppId) => void;
}

interface CommandItem {
  name: string;
  group: "NAVIGATION" | "ACTIONS" | "SYSTEM";
  icon: LucideIcon;
  shortcut?: string;
  action: () => void;
}

function CommandPalette({ isOpen, onClose, openApp }: CommandPaletteProps): JSX.Element | null {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerAccentFlash = (sectionId: string) => {
    const accentColors: Record<string, string> = {
      home: "#00ff41",
      about: "#00ff41",
      projects: "#00ff41",
      skills: "#7c3aed",
      achievements: "#f59e0b",
      terminal: "#00ff41",
      contact: "#7c3aed",
    };
    const color = accentColors[sectionId] || "#00ff41";
    
    const flash = document.createElement("div");
    flash.style.position = "fixed";
    flash.style.inset = "0";
    flash.style.zIndex = "9000";
    flash.style.backgroundColor = color;
    flash.style.opacity = "0";
    flash.style.pointerEvents = "none";
    flash.style.transition = "opacity 0.2s ease-out";
    
    document.body.appendChild(flash);
    
    requestAnimationFrame(() => {
      flash.style.opacity = "0.03";
      setTimeout(() => {
        flash.style.transition = "opacity 0.2s ease-in";
        flash.style.opacity = "0";
        setTimeout(() => {
          flash.remove();
        }, 200);
      }, 200);
    });
  };

  const commands: CommandItem[] = [
    {
      name: "Home",
      group: "NAVIGATION",
      icon: Home,
      shortcut: "G H",
      action: () => {
        const el = document.getElementById("home");
        if (el) {
          triggerAccentFlash("home");
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    {
      name: "Projects",
      group: "NAVIGATION",
      icon: FolderOpen,
      shortcut: "G P",
      action: () => {
        const el = document.getElementById("projects");
        if (el) {
          triggerAccentFlash("projects");
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    {
      name: "Skills",
      group: "NAVIGATION",
      icon: Cpu,
      shortcut: "G S",
      action: () => {
        const el = document.getElementById("skills");
        if (el) {
          triggerAccentFlash("skills");
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    {
      name: "Terminal",
      group: "NAVIGATION",
      icon: Terminal,
      shortcut: "G T",
      action: () => {
        const el = document.getElementById("terminal");
        if (el) {
          triggerAccentFlash("terminal");
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    {
      name: "Achievements",
      group: "NAVIGATION",
      icon: Trophy,
      shortcut: "G A",
      action: () => {
        const el = document.getElementById("achievements");
        if (el) {
          triggerAccentFlash("achievements");
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    {
      name: "Contact",
      group: "NAVIGATION",
      icon: Mail,
      shortcut: "G C",
      action: () => {
        const el = document.getElementById("contact");
        if (el) {
          triggerAccentFlash("contact");
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    {
      name: "Download Resume",
      group: "ACTIONS",
      icon: Download,
      action: () => {
        const link = document.createElement("a");
        link.href = "/resume.pdf";
        link.download = "Ashish_Kumar_Jha_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    {
      name: "Copy Email",
      group: "ACTIONS",
      icon: Copy,
      action: () => {
        navigator.clipboard.writeText("ashish863863@gmail.com");
        alert("Email copied to clipboard: ashish863863@gmail.com");
      }
    },
    {
      name: "Open GitHub",
      group: "ACTIONS",
      icon: Github,
      action: () => {
        window.open("https://github.com/AshishXoTech", "_blank");
      }
    },
    {
      name: "Open LinkedIn",
      group: "ACTIONS",
      icon: Linkedin,
      action: () => {
        window.open("https://www.linkedin.com/in/ashish-kumar-jha-43887726b", "_blank");
      }
    },
    {
      name: "Toggle Theme",
      group: "SYSTEM",
      icon: Sun,
      action: () => {
        alert("Theme locked to Dark Mode for developer aesthetics.");
      }
    },
    {
      name: "View Changelog",
      group: "SYSTEM",
      icon: List,
      shortcut: "?",
      action: () => {
        window.dispatchEvent(new CustomEvent("toggle-shortcuts-help"));
      }
    }
  ];

  const filtered = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        onClose();
      }
    }
  };

  const navigationGroup = filtered.filter(c => c.group === "NAVIGATION");
  const actionsGroup = filtered.filter(c => c.group === "ACTIONS");
  const systemGroup = filtered.filter(c => c.group === "SYSTEM");

  const flatList = [...navigationGroup, ...actionsGroup, ...systemGroup];

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-start justify-center bg-black/60 pt-[15vh] p-4 backdrop-blur-sm cursor-default"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[560px] rounded-2xl border border-white/10 bg-[rgba(5,5,16,0.96)] shadow-[0_32px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
          <Search className="h-4 w-4 text-[#444]" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search or jump to..."
            className="w-full bg-transparent font-mono text-sm text-[#e0e0e0] outline-none placeholder:text-[#333] caret-green"
          />
        </div>

        <div className="max-h-[360px] overflow-y-auto p-2">
          {flatList.length === 0 ? (
            <div className="py-12 text-center font-sans text-sm text-[#555]">
              No commands found
            </div>
          ) : (
            <>
              {navigationGroup.length > 0 && (
                <div>
                  <div className="px-3 py-2 font-mono text-[9px] font-bold tracking-[0.15em] text-[#333] uppercase">
                    NAVIGATION
                  </div>
                  {navigationGroup.map((cmd) => {
                    const globalIdx = flatList.indexOf(cmd);
                    const isSelected = selectedIndex === globalIdx;
                    const CmdIcon = cmd.icon;
                    return (
                      <div
                        key={cmd.name}
                        onClick={() => {
                          cmd.action();
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={[
                          "flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors",
                          isSelected ? "bg-white/[0.05]" : "bg-transparent",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] text-green">
                            <CmdIcon className="h-4 w-4" />
                          </span>
                          <span className="font-sans text-sm text-[#e0e0e0]">{cmd.name}</span>
                        </div>
                        {cmd.shortcut && (
                          <kbd className="rounded border border-white/[0.08] px-1.5 py-0.5 font-mono text-[9px] text-[#444]">
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {actionsGroup.length > 0 && (
                <div className="mt-2">
                  <div className="px-3 py-2 font-mono text-[9px] font-bold tracking-[0.15em] text-[#333] uppercase">
                    ACTIONS
                  </div>
                  {actionsGroup.map((cmd) => {
                    const globalIdx = flatList.indexOf(cmd);
                    const isSelected = selectedIndex === globalIdx;
                    const CmdIcon = cmd.icon;
                    return (
                      <div
                        key={cmd.name}
                        onClick={() => {
                          cmd.action();
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={[
                          "flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors",
                          isSelected ? "bg-white/[0.05]" : "bg-transparent",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] text-purple">
                            <CmdIcon className="h-4 w-4" />
                          </span>
                          <span className="font-sans text-sm text-[#e0e0e0]">{cmd.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {systemGroup.length > 0 && (
                <div className="mt-2">
                  <div className="px-3 py-2 font-mono text-[9px] font-bold tracking-[0.15em] text-[#333] uppercase">
                    SYSTEM
                  </div>
                  {systemGroup.map((cmd) => {
                    const globalIdx = flatList.indexOf(cmd);
                    const isSelected = selectedIndex === globalIdx;
                    const CmdIcon = cmd.icon;
                    return (
                      <div
                        key={cmd.name}
                        onClick={() => {
                          cmd.action();
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={[
                          "flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors",
                          isSelected ? "bg-white/[0.05]" : "bg-transparent",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] text-amber-500">
                            <CmdIcon className="h-4 w-4" />
                          </span>
                          <span className="font-sans text-sm text-[#e0e0e0]">{cmd.name}</span>
                        </div>
                        {cmd.shortcut && (
                          <kbd className="rounded border border-white/[0.08] px-1.5 py-0.5 font-mono text-[9px] text-[#444]">
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

