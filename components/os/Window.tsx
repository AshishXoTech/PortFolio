"use client";

import { motion, useDragControls, useMotionValue } from "framer-motion";
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const TASKBAR_HEIGHT = 48;
const TITLE_BAR_HEIGHT = 38;

export interface WindowProps {
  id: string;
  title: string;
  children: ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  isActive: boolean;
  isMinimized: boolean;
  zIndex: number;
  dragConstraintsRef: RefObject<HTMLElement | null>;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
}

interface WindowTrafficLightsProps {
  onClose: () => void;
  onMinimize: () => void;
}

function WindowTrafficLights({
  onClose,
  onMinimize,
}: WindowTrafficLightsProps): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        aria-label="Close window"
        className="group relative flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57]"
      >
        <span
          className="pointer-events-none text-[9px] font-bold leading-none text-[#4d0000] opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        >
          ×
        </span>
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onMinimize();
        }}
        aria-label="Minimize window"
        className="group relative flex h-3 w-3 items-center justify-center rounded-full bg-[#ffbd2e]"
      >
        <span
          className="pointer-events-none text-[10px] font-bold leading-none text-[#4d3b00] opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        >
          −
        </span>
      </button>
      <button
        type="button"
        aria-label="Maximize window"
        tabIndex={-1}
        className="h-3 w-3 rounded-full bg-[#28ca42]"
      />
    </div>
  );
}

function WindowComponent({
  id,
  title,
  children,
  defaultPosition = { x: 120, y: 80 },
  defaultSize = { width: 800, height: 560 },
  isActive,
  isMinimized: _isMinimized,
  zIndex,
  dragConstraintsRef,
  onFocus,
  onClose,
  onMinimize,
}: WindowProps): JSX.Element | null {
  const isMobile = useIsMobile();
  const dragControls = useDragControls();
  const x = useMotionValue(defaultPosition.x);
  const y = useMotionValue(defaultPosition.y);
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const minimizeCompletedRef = useRef(false);

  useEffect(() => {
    if (!isMobile) {
      x.set(defaultPosition.x);
      y.set(defaultPosition.y);
    }
  }, [defaultPosition.x, defaultPosition.y, isMobile, x, y]);

  const handleFocus = useCallback(() => {
    onFocus();
  }, [onFocus]);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      handleFocus();
      if (!isMobile) {
        dragControls.start(event);
      }
    },
    [dragControls, handleFocus, isMobile]
  );

  const handleMinimizeClick = useCallback(() => {
    setIsMinimizing(true);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    if (!isMinimizing || minimizeCompletedRef.current) return;
    minimizeCompletedRef.current = true;
    onMinimize();
    setIsVisible(false);
  }, [isMinimizing, onMinimize]);

  const handleContainerPointerDown = useCallback(() => {
    handleFocus();
  }, [handleFocus]);

  if (!isVisible) {
    return null;
  }

  const activeShadow =
    "0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.05)";
  const inactiveShadow = "0 16px 40px rgba(0,0,0,0.7)";

  return (
    <motion.div
      layout={false}
      drag={!isMobile && !isMinimizing}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragConstraints={dragConstraintsRef}
      onDragStart={() => {
        setIsDragging(true);
        handleFocus();
      }}
      onDragEnd={() => setIsDragging(false)}
      style={
        isMobile
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: `calc(100vh - ${TASKBAR_HEIGHT}px)`,
              zIndex,
            }
          : {
              position: "fixed",
              width: defaultSize.width,
              height: defaultSize.height,
              zIndex,
              x,
              y,
            }
      }
      initial={{ scale: 0.9, opacity: 0 }}
      animate={
        isMinimizing
          ? {
              scale: 0.1,
              opacity: 0,
              y: defaultPosition.y + 200,
              transition: { duration: 0.25, ease: [0.36, 0, 0.66, -0.56] },
            }
          : {
              scale: 1,
              opacity: 1,
              transition: { type: "spring", stiffness: 400, damping: 30 },
            }
      }
      onAnimationComplete={handleAnimationComplete}
      onPointerDown={handleContainerPointerDown}
      className={cn(
        "pointer-events-auto flex flex-col overflow-hidden",
        isMobile ? "rounded-none" : "rounded-xl"
      )}
      role="dialog"
      aria-label={title}
      id={`window-${id}`}
    >
      <div
        className={cn(
          "flex flex-col overflow-hidden border border-[rgba(255,255,255,0.07)] transition-[box-shadow] duration-200 ease-out",
          isMobile ? "h-full rounded-none" : "h-full rounded-xl"
        )}
        style={{
          background: "rgba(10, 10, 10, 0.92)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          boxShadow: isActive ? activeShadow : inactiveShadow,
        }}
      >
        <div
          onPointerDown={handlePointerDown}
          className={cn(
            "relative flex h-[38px] shrink-0 items-center border-b border-[rgba(255,255,255,0.05)] px-[14px]",
            isMobile ? "rounded-none" : "rounded-t-xl",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
          style={{ background: "rgba(20,20,20,0.6)" }}
        >
          <div className="z-10 flex items-center">
            <WindowTrafficLights
              onClose={onClose}
              onMinimize={handleMinimizeClick}
            />
          </div>

          <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-xs text-[#666666]">
            {title}
          </span>

          <div className="ml-auto w-[52px]" aria-hidden="true" />
        </div>

        <div
          className="window-scrollbar overflow-auto p-4"
          style={{ height: `calc(100% - ${TITLE_BAR_HEIGHT}px)` }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function areWindowPropsEqual(
  prev: WindowProps,
  next: WindowProps
): boolean {
  return (
    prev.id === next.id &&
    prev.title === next.title &&
    prev.isActive === next.isActive &&
    prev.isMinimized === next.isMinimized &&
    prev.zIndex === next.zIndex &&
    prev.defaultPosition?.x === next.defaultPosition?.x &&
    prev.defaultPosition?.y === next.defaultPosition?.y &&
    prev.defaultSize?.width === next.defaultSize?.width &&
    prev.defaultSize?.height === next.defaultSize?.height &&
    prev.onFocus === next.onFocus &&
    prev.onClose === next.onClose &&
    prev.onMinimize === next.onMinimize &&
    prev.dragConstraintsRef === next.dragConstraintsRef &&
    prev.children === next.children
  );
}

const Window = memo(WindowComponent, areWindowPropsEqual);
Window.displayName = "Window";

export default Window;
