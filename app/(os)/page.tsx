"use client";

import BootScreen from "@/components/os/BootScreen";
import LoginScreen from "@/components/os/LoginScreen";
import { Desktop } from "@/components/os/Desktop";
import { useOS } from "@/hooks/useOS";

export default function OSPage(): JSX.Element {
  const { bootStage, setBootStage } = useOS();

  if (bootStage === "matrix" || bootStage === "logs" || bootStage === "progress") {
    return <BootScreen onBootComplete={() => setBootStage("login")} />;
  }

  if (bootStage === "login") {
    return <LoginScreen onLogin={() => setBootStage("desktop")} />;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes desktop-landing {
          0% { opacity: 0; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        .desktop-entry-animation {
          animation: desktop-landing 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      ` }} />
      <div className="desktop-entry-animation">
        <Desktop />
      </div>
    </>
  );
}
