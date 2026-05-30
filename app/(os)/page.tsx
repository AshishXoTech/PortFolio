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

  return <Desktop />;
}
