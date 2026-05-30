"use client";

import { useCallback, useRef, useState } from "react";
import {
  autocompleteCommand,
  getAchievementsLines,
  getCatResumeLines,
  getContactLines,
  getEducationLines,
  getHelpLines,
  getNeofetchLines,
  getOpenLines,
  getProjectsLines,
  getRmRfLines,
  getSkillsLines,
  getSudoHireLines,
  getUnknownCommandLines,
  getWhoamiLines,
} from "@/lib/terminal/commands";
import type { TerminalLine } from "@/lib/terminal/types";
import { useOS } from "@/hooks/useOS";
import type { AppId } from "@/types/os";

export type { TerminalLine, TerminalTone } from "@/lib/terminal/types";

const PROMPT = "[ashish@portfolio ~]$";
const MAX_HISTORY = 50;

function createLine(
  content: string,
  tone: TerminalLine["tone"] = "default",
  animate = false
): TerminalLine {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    tone,
    content,
    animate,
  };
}

function getWelcomeLines(): TerminalLine[] {
  return [
    createLine("AshishOS Terminal v1.0.0", "default", true),
    createLine("Type 'help' to see available commands.", "muted", true),
    createLine("", "default"),
  ];
}

interface UseTerminalHistoryReturn {
  lines: TerminalLine[];
  prompt: string;
  executeCommand: (input: string) => void;
  clearHistory: () => void;
  commandHistory: string[];
  historyIndex: number | null;
  navigateHistory: (direction: "up" | "down", currentInput?: string) => string | null;
  getAutocomplete: (value: string) => string | null;
  triggerResumeDownload: boolean;
  consumeResumeDownload: () => void;
}

export function useTerminalHistory(): UseTerminalHistoryReturn {
  const { openApp } = useOS();
  const [lines, setLines] = useState<TerminalLine[]>(getWelcomeLines);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [triggerResumeDownload, setTriggerResumeDownload] = useState(false);
  const draftRef = useRef("");

  const consumeResumeDownload = useCallback(() => {
    setTriggerResumeDownload(false);
  }, []);

  const clearHistory = useCallback(() => {
    setLines([]);
    setHistoryIndex(null);
  }, []);

  const executeCommand = useCallback(
    (input: string) => {
      const trimmed = input.trim();
      setHistoryIndex(null);

      const inputLine = createLine(`${PROMPT} ${trimmed}`, "input");
      const outputLines: TerminalLine[] = [];

      if (trimmed) {
        setCommandHistory((prev) => {
          const next = [...prev, trimmed];
          return next.slice(-MAX_HISTORY);
        });
      }

      if (!trimmed) {
        setLines((prev) => [...prev, inputLine]);
        return;
      }

      const lower = trimmed.toLowerCase();
      const parts = trimmed.split(/\s+/);
      const command = parts[0].toLowerCase();

      if (command === "clear") {
        setLines([]);
        return;
      }

      if (command === "help") {
        outputLines.push(...getHelpLines());
      } else if (command === "whoami") {
        outputLines.push(...getWhoamiLines());
      } else if (command === "neofetch") {
        outputLines.push(...getNeofetchLines());
      } else if (command === "skills") {
        outputLines.push(...getSkillsLines());
      } else if (command === "projects") {
        outputLines.push(...getProjectsLines());
      } else if (command === "education") {
        outputLines.push(...getEducationLines());
      } else if (command === "achievements") {
        outputLines.push(...getAchievementsLines());
      } else if (command === "contact") {
        outputLines.push(...getContactLines());
      } else if (command === "open") {
        outputLines.push(...getOpenLines(parts.slice(1).join(" "), openApp));
      } else if (lower === "cat resume.pdf") {
        outputLines.push(...getCatResumeLines());
        setTriggerResumeDownload(true);
      } else if (lower === "sudo hire ashish") {
        outputLines.push(...getSudoHireLines());
      } else if (lower === "rm -rf portfolio") {
        outputLines.push(...getRmRfLines());
      } else {
        outputLines.push(...getUnknownCommandLines(trimmed));
      }

      setLines((prev) => [...prev, inputLine, ...outputLines]);
    },
    [openApp]
  );

  const navigateHistory = useCallback(
    (direction: "up" | "down", currentInput = ""): string | null => {
      if (commandHistory.length === 0) return null;

      if (direction === "up") {
        if (historyIndex === null) {
          draftRef.current = currentInput;
        }

        const nextIndex =
          historyIndex === null
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);

        setHistoryIndex(nextIndex);
        return commandHistory[nextIndex] ?? null;
      }

      if (historyIndex === null) return null;

      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(null);
        return draftRef.current;
      }

      setHistoryIndex(nextIndex);
      return commandHistory[nextIndex] ?? null;
    },
    [commandHistory, historyIndex]
  );

  const getAutocomplete = useCallback((value: string): string | null => {
    return autocompleteCommand(value);
  }, []);

  return {
    lines,
    prompt: PROMPT,
    executeCommand,
    clearHistory,
    commandHistory,
    historyIndex,
    navigateHistory,
    getAutocomplete,
    triggerResumeDownload,
    consumeResumeDownload,
  };
}
