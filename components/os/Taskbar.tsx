"use client";

import { Clock, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { useOS } from "@/hooks/useOS";
import { cn } from "@/lib/utils";
import type { AppId } from "@/types/os";

export function Taskbar(): JSX.Element {
  const { windows, openApp, focusApp } = useOS();
  const [time, setTime] = useState("");

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
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleTaskClick = (windowId: string, appId: AppId): void => {
    const window = windows.find((w) => w.id === windowId);
    if (window?.isMinimized) {
      focusApp(windowId);
    } else {
      openApp(appId);
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-[500] flex h-12 items-center justify-between border-t border-glass bg-glass px-4 backdrop-blur-glass">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-bold text-green">AshishOS</span>
        <div className="flex gap-1">
          {windows.map((window) => (
            <button
              key={window.id}
              type="button"
              onClick={() => handleTaskClick(window.id, window.appId)}
              className={cn(
                "rounded px-2 py-1 font-mono text-xs transition-colors",
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

      <div className="flex items-center gap-3 font-mono text-xs text-muted">
        <Wifi className="h-4 w-4 text-green" aria-hidden="true" />
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {time}
        </span>
      </div>
    </footer>
  );
}
