"use client";

import { useEffect, useState } from "react";
import { useOS } from "@/hooks/useOS";
import { cn } from "@/lib/utils";
import type { AppId } from "@/types/os";

export function Taskbar(): JSX.Element {
  const { windows, openApp, focusApp } = useOS();
  const [time, setTime] = useState("");
  const [visits, setVisits] = useState(247);

  useEffect(() => {
    const update = (): void => {
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date())
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const visitInterval = setInterval(() => {
      setVisits((prev) => prev + (Math.random() > 0.4 ? 1 : 0));
    }, 45000); // Increment every 45s
    return () => clearInterval(visitInterval);
  }, []);

  const handleTaskClick = (windowId: string, appId: AppId): void => {
    const window = windows.find((w) => w.id === windowId);
    if (window?.isMinimized) {
      focusApp(windowId);
    } else {
      openApp(appId);
    }
  };

  const triggerCmdK = () => {
    window.dispatchEvent(new CustomEvent("toggle-command-palette"));
  };

  const triggerShortcuts = () => {
    window.dispatchEvent(new CustomEvent("toggle-shortcuts-help"));
  };

  return (
    <footer className="group fixed bottom-0 left-0 right-0 z-[999] flex h-9 items-center justify-between border-t border-white/[0.04] bg-[rgba(5,5,16,0.9)] px-5 backdrop-blur-[20px] transition-colors hover:border-white/[0.08] hover:bg-[rgba(5,5,16,0.95)]">
      <div className="flex min-w-0 items-center gap-3">
        <span className="shrink-0 font-mono text-[11px] font-semibold text-green">
          AshishOS
        </span>
        <span className="hidden shrink-0 font-mono text-[9px] text-[#2a2a3a] md:inline">
          ·
        </span>
        <span className="hidden shrink-0 font-mono text-[9px] text-[#2a2a3a] md:inline select-none">
          👁 {visits} visits today
        </span>
        <div className="hidden max-w-[260px] gap-1 overflow-hidden md:flex">
          {windows.map((window) => (
            <button
              key={window.id}
              type="button"
              onClick={() => handleTaskClick(window.id, window.appId)}
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] transition-colors",
                window.isMinimized
                  ? "text-muted hover:text-text"
                  : "bg-green/10 text-green"
              )}
            >
              {window.title}
            </button>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute left-1/2 hidden w-[500px] max-w-[42vw] -translate-x-1/2 overflow-hidden whitespace-nowrap font-mono text-[10px] tracking-[0.05em] text-[#333] md:block">
        <div className="bottom-taskbar-ticker inline-flex gap-6">
          <span>B.Tech CSE 2024-2028</span>
          <span>|</span>
          <span>UEM Jaipur</span>
          <span>|</span>
          <span>Software Engineer track: Java + DSA</span>
          <span>|</span>
          <span>AshishXoTech</span>
          <span>|</span>
          <span>B.Tech CSE 2024-2028</span>
          <span>|</span>
          <span>UEM Jaipur</span>
          <span>|</span>
          <span>Software Engineer track: Java + DSA</span>
          <span>|</span>
          <span>AshishXoTech</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 font-mono text-[10px] text-[#333]">
        <button
          type="button"
          onClick={triggerCmdK}
          className="hidden font-mono text-[9px] text-[#2a2a3a] hover:text-[#555] transition-colors cursor-pointer md:inline focus:outline-none"
        >
          ⌘K
        </button>
        <span className="hidden font-mono text-[9px] text-[#2a2a3a] md:inline select-none">·</span>
        <button
          type="button"
          onClick={triggerShortcuts}
          className="hidden font-mono text-[9px] text-[#2a2a3a] hover:text-[#555] transition-colors cursor-pointer md:inline focus:outline-none"
        >
          ?
        </button>
        <span className="hidden font-mono text-[9px] text-[#2a2a3a] md:inline select-none">·</span>
        <span>{time}</span>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green shadow-[0_0_8px_rgba(0,255,65,0.8)]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
      </div>
    </footer>
  );
}
