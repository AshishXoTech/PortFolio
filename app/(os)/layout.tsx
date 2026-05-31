import OSProvider from "@/providers/OSProvider";
import LenisProvider from "@/providers/LenisProvider";
import { WindowManager } from "@/components/os/WindowManager";

interface OSLayoutProps {
  children: React.ReactNode;
}

export default function OSLayout({ children }: OSLayoutProps): JSX.Element {
  return (
    <LenisProvider>
      <OSProvider>
        {children}
        <WindowManager />
      </OSProvider>
    </LenisProvider>
  );
}
