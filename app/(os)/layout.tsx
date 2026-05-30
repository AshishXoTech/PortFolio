import OSProvider from "@/providers/OSProvider";
import { WindowManager } from "@/components/os/WindowManager";

interface OSLayoutProps {
  children: React.ReactNode;
}

export default function OSLayout({ children }: OSLayoutProps): JSX.Element {
  return (
    <OSProvider>
      {children}
      <WindowManager />
    </OSProvider>
  );
}
