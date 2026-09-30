import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useLogout } from "@auth/application/useLogout";
import { useSidebar } from "../sidebar/SidebarProvider";

const N1_WIDTH = 56;

export function AppSidebar() {
  const {
    modules,
    activeModule,
    n2Expanded,
    width,
    setN2Expanded,
    setWidth,
    activateModule,
  } = useSidebar();
  const { user } = useAuth();
  const { execute: logout, isLoading: loggingOut } = useLogout();
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e: MouseEvent) => setWidth(e.clientX - N1_WIDTH);
    const onUp = () => setIsResizing(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    document.body.style.userSelect = "none";
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.userSelect = "";
    };
  }, [isResizing, setWidth]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      const key = e.key.toLowerCase();
      if (key === "b" && !typing && !e.shiftKey) {
        e.preventDefault();
        setN2Expanded(!n2Expanded);
        return;
      }
      const index = Number(e.key);
      if (Number.isInteger(index) && index >= 1 && index <= modules.length) {
        e.preventDefault();
        activateModule(modules[index - 1].id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modules, activateModule, n2Expanded, setN2Expanded]);

  const { Panel, Actions, Footer } = activeModule;
  const initial = (user?.displayName || user?.email || "?").charAt(0).toUpperCase();

  return (
    <>
      <nav
        aria-label="Módulos"
        className="flex flex-col items-center gap-2 py-3 shrink-0 relative z-30"
        style={{
          width: N1_WIDTH,
          backgroundColor: "var(--color-bg-surface)",
          borderRight: "1px solid var(--color-border)",
        }}
      >
        <div
          className="w-8 h-8 flex items-center justify-center rounded-lg font-bold mb-1"
          style={{ color: "var(--color-heading)" }}
          title="NoNotion"
        >
          N
        </div>

        {modules.map((module) => {
          const isActive = module.id === activeModule.id;
          return (
            <button
              key={module.id}
              type="button"
              onClick={() => activateModule(module.id)}
              title={module.name}
              aria-label={module.name}
              aria-current={isActive ? "page" : undefined}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl text-lg cursor-pointer transition-all focus-visible:outline focus-visible:outline-2"
              style={{
                backgroundColor: isActive ? "var(--color-accent-primary)" : "transparent",
                color: isActive ? "#fff" : "var(--color-text-primary)",
                boxShadow: isActive ? "var(--shadow-neo-pressed-sm)" : "none",
              }}
            >
              <span aria-hidden="true">{module.icon}</span>
              {typeof module.badge === "number" && module.badge > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 flex items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: "var(--color-danger)", fontSize: "9px" }}
                >
                  {module.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="mt-auto flex flex-col items-center gap-2">
          <button
            type="button"
            title="Settings (coming soon)"
            aria-label="Settings"
            className="w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer"
            style={{ color: "var(--color-text-muted)" }}
          >
            ⚙
          </button>
          <button
            type="button"
            title="Help (coming soon)"
            aria-label="Help"
            className="w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer"
            style={{ color: "var(--color-text-muted)" }}
          >
            ?
          </button>
          <button
            type="button"
            title={user?.displayName ?? "Profile"}
            aria-label="Profile"
            className="w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold cursor-pointer"
            style={{
              backgroundColor: "var(--color-accent-light)",
              color: "#fff",
            }}
          >
            {initial}
          </button>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            title="Sign out"
            aria-label="Sign out"
            className="w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer disabled:opacity-50"
            style={{ color: "var(--color-danger)" }}
          >
            ⎋
          </button>
        </div>
      </nav>

      {n2Expanded && (
        <>
          <section
            aria-label={`${activeModule.name} Panel`}
            className="flex flex-col h-full shrink-0 max-md:fixed max-md:top-0 max-md:bottom-0 max-md:left-14 max-md:z-40"
            style={{
              width,
              backgroundColor: "var(--color-bg-surface)",
              borderRight: "1px solid var(--color-border)",
            }}
          >
            <header className="flex items-center gap-2 px-3 py-3">
              <h2
                className="font-semibold text-sm truncate"
                style={{ color: "var(--color-heading)" }}
              >
                {activeModule.name}
              </h2>
              <div className="flex items-center gap-1 ml-auto">
                {Actions && <Actions />}
                <button
                  type="button"
                  onClick={() => setN2Expanded(false)}
                  title="Minimize panel (Ctrl+B)"
                  aria-label="Minimize panel"
                  className="w-6 h-6 flex items-center justify-center rounded-lg cursor-pointer text-xs"
                  style={{ boxShadow: "var(--shadow-neo-raised-sm)", color: "var(--color-text-muted)" }}
                >
                  «
                </button>
              </div>
            </header>

            <div className="flex-1 min-h-0 overflow-hidden">
              <Panel />
            </div>

            {Footer && <Footer />}
          </section>

          <div
            role="separator"
            aria-orientation="vertical"
            title="Drag to resize · double click to minimize"
            onMouseDown={() => setIsResizing(true)}
            onDoubleClick={() => setN2Expanded(false)}
            className="w-1 shrink-0 cursor-col-resize max-md:hidden"
            style={{
              backgroundColor: isResizing
                ? "var(--color-accent-primary)"
                : "transparent",
            }}
          />
        </>
      )}
    </>
  );
}
