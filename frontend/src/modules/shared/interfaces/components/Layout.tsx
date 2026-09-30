import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-surface)" }}
    >
      <AppSidebar />
      <main className="relative z-0 flex-1 min-w-0 h-screen overflow-hidden">
        {children}
      </main>
    </div>
  );
}
