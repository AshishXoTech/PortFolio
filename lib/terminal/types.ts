export type TerminalTone =
  | "input"
  | "default"
  | "error"
  | "muted"
  | "green"
  | "purple"
  | "gold"
  | "silver"
  | "bronze"
  | "success";

export interface TerminalLine {
  id: string;
  tone: TerminalTone;
  content: string;
  animate?: boolean;
}
