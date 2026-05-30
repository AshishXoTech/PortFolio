"use client";

interface TrafficLightsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export function TrafficLights({
  onClose,
  onMinimize,
  onMaximize,
}: TrafficLightsProps): JSX.Element {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close window"
        className="h-3 w-3 rounded-full bg-red transition-opacity hover:opacity-80"
      />
      <button
        type="button"
        onClick={onMinimize}
        aria-label="Minimize window"
        className="h-3 w-3 rounded-full bg-yellow-400 transition-opacity hover:opacity-80"
      />
      <button
        type="button"
        onClick={onMaximize}
        aria-label="Maximize window"
        className="h-3 w-3 rounded-full bg-green transition-opacity hover:opacity-80"
      />
    </div>
  );
}
