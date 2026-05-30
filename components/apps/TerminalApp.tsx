"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  useTerminalHistory,
  type TerminalLine,
} from "@/hooks/useTerminalHistory";
import { cn } from "@/lib/utils";

const TYPEWRITER_MS = 8;

const TONE_STYLES: Record<TerminalLine["tone"], string> = {
  input: "text-[#00ff41]",
  default: "text-[#e0e0e0]",
  error: "text-[#ff5f57]",
  muted: "text-[#888888]",
  green: "text-[#00ff41]",
  purple: "text-[#7c3aed]",
  gold: "text-[#ffd700]",
  silver: "text-[#c0c0c0]",
  bronze: "text-[#cd7f32]",
  success: "text-[#00ff41] text-base font-bold",
};

interface AnimatedLineProps {
  line: TerminalLine;
  onComplete: () => void;
  skipSignal: number;
}

function AnimatedLine({
  line,
  onComplete,
  skipSignal,
}: AnimatedLineProps): JSX.Element {
  const [visibleLength, setVisibleLength] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
    setVisibleLength(0);

    const interval = window.setInterval(() => {
      setVisibleLength((prev) => {
        if (prev >= line.content.length) {
          window.clearInterval(interval);
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
          return line.content.length;
        }
        return prev + 1;
      });
    }, TYPEWRITER_MS);

    return () => window.clearInterval(interval);
  }, [line.content, line.id, onComplete]);

  useEffect(() => {
    if (skipSignal > 0) {
      setVisibleLength(line.content.length);
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }
  }, [skipSignal, line.content.length, onComplete]);

  return (
    <p className={cn("whitespace-pre-wrap", TONE_STYLES[line.tone])}>
      {line.content.slice(0, visibleLength) || "\u00A0"}
    </p>
  );
}

function StaticLine({ line }: { line: TerminalLine }): JSX.Element {
  return (
    <p className={cn("whitespace-pre-wrap", TONE_STYLES[line.tone])}>
      {line.content || "\u00A0"}
    </p>
  );
}

export default function TerminalApp(): JSX.Element {
  const {
    lines,
    prompt,
    executeCommand,
    clearHistory,
    navigateHistory,
    getAutocomplete,
    triggerResumeDownload,
    consumeResumeDownload,
  } = useTerminalHistory();

  const [inputValue, setInputValue] = useState("");
  const [skipSignal, setSkipSignal] = useState(0);
  const [completedLineIds, setCompletedLineIds] = useState<Set<string>>(
    new Set()
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeAnimatedLineId = lines.find(
    (line) => line.animate && !completedLineIds.has(line.id)
  )?.id;

  const isAnimating = Boolean(activeAnimatedLineId);

  const scrollToBottom = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, completedLineIds, scrollToBottom]);

  useEffect(() => {
    if (triggerResumeDownload) {
      window.open("/resume.pdf", "_blank");
      consumeResumeDownload();
    }
  }, [triggerResumeDownload, consumeResumeDownload]);

  const handleLineComplete = useCallback((lineId: string) => {
    setCompletedLineIds((prev) => new Set(prev).add(lineId));
  }, []);

  const skipTypewriter = useCallback(() => {
    setSkipSignal((n) => n + 1);
    setCompletedLineIds((prev) => {
      const next = new Set(prev);
      lines.forEach((line) => {
        if (line.animate) next.add(line.id);
      });
      return next;
    });
  }, [lines]);

  const handleContainerClick = (): void => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" && isAnimating) {
      event.preventDefault();
      skipTypewriter();
      return;
    }

    if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      clearHistory();
      setCompletedLineIds(new Set());
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const suggestion = getAutocomplete(inputValue);
      if (suggestion) setInputValue(suggestion);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const previous = navigateHistory("up", inputValue);
      if (previous !== null) setInputValue(previous);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = navigateHistory("down", inputValue);
      if (next !== null) setInputValue(next);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (isAnimating) {
      skipTypewriter();
      return;
    }
    executeCommand(inputValue);
    setInputValue("");
  };

  return (
    <div
      className="flex h-full min-h-[360px] flex-col bg-[#0a0a0a] font-mono text-[13px] leading-[1.65]"
      onClick={handleContainerClick}
      role="presentation"
    >
      <header
        className="flex shrink-0 items-center justify-between border-b border-[rgba(255,255,255,0.05)] px-3.5 py-2"
        style={{ background: "rgba(20,20,20,0.6)" }}
      >
        <span className="text-xs text-[#666666]">terminal.sh — bash</span>
        <span
          className="h-2 w-2 animate-pulse rounded-full bg-[#00ff41] shadow-[0_0_6px_#00ff41]"
          aria-hidden="true"
        />
      </header>

      <div
        ref={containerRef}
        className="window-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-3"
      >
        <div className="flex flex-col gap-0.5">
          {lines.map((line) => {
            if (line.animate && !completedLineIds.has(line.id)) {
              if (line.id !== activeAnimatedLineId) {
                return null;
              }

              return (
                <AnimatedLine
                  key={line.id}
                  line={line}
                  skipSignal={skipSignal}
                  onComplete={() => handleLineComplete(line.id)}
                />
              );
            }

            return <StaticLine key={line.id} line={line} />;
          })}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 items-center gap-2 border-t border-[rgba(255,255,255,0.05)] px-3 py-2.5"
      >
        <span className="shrink-0 text-[#00ff41]">{prompt}</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="min-w-0 flex-1 border-0 bg-transparent text-[#e0e0e0] outline-none ring-0 focus:outline-none focus:ring-0"
          aria-label="Terminal command input"
        />
      </form>
    </div>
  );
}
