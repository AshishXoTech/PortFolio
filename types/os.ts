export type AppId =
  | "about"
  | "projects"
  | "skills"
  | "terminal"
  | "achievements"
  | "blog"
  | "contact";

export type BootStage = "matrix" | "logs" | "progress" | "login" | "desktop";

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  zIndex: number;
  position: WindowPosition;
  size: WindowSize;
}

export interface OSContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  bootStage: BootStage;
  openApp: (appId: AppId) => void;
  closeApp: (id: string) => void;
  focusApp: (id: string) => void;
  minimizeApp: (id: string) => void;
  setBootStage: (stage: BootStage) => void;
}
