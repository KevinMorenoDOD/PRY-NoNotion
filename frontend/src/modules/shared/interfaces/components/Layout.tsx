import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-surface)" }}
    >
      <Sidebar />
      <main className="relative z-0 flex-1 min-w-0 h-screen overflow-hidden">{children}</main>
    </div>
  );
}
