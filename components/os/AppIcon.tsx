"use client";

import type { LucideIcon } from "lucide-react";
import { useOS } from "@/hooks/useOS";
import type { AppId } from "@/types/os";

interface AppIconProps {
  appId: AppId;
  label: string;
  icon: LucideIcon;
}

export function AppIcon({ appId, label, icon: Icon }: AppIconProps): JSX.Element {
  const { openApp } = useOS();

  return (
    <button
      type="button"
      onClick={() => openApp(appId)}
      className="group flex flex-col items-center gap-2 rounded-lg p-3 transition-colors hover:bg-white/5"
      aria-label={`Open ${label}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-glass bg-glass backdrop-blur-glass transition-transform group-hover:scale-105">
        <Icon className="h-7 w-7 text-green" aria-hidden="true" />
      </div>
      <span className="max-w-[80px] truncate font-mono text-xs text-text">
        {label}
      </span>
    </button>
  );
}
