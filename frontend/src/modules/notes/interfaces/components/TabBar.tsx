import { useRef } from "react";
import type { NoteNode } from "../../domain/NoteNode";
import { nodeTitle } from "../../domain/NoteNode";

interface TabBarProps {
  nodes: NoteNode[];
  openTabs: number[];
  activeTabId: number | null;
  onActivate: (id: number) => void;
  onClose: (id: number) => void;
  onCloseAll: () => void;
  onNew: () => void;
  onReorder: (fromId: number, toId: number) => void;
}

export function TabBar({
  nodes,
  openTabs,
  activeTabId,
  onActivate,
  onClose,
  onCloseAll,
  onNew,
  onReorder,
}: TabBarProps) {
  const dragId = useRef<number | null>(null);

  const tabs = openTabs
    .map((id) => nodes.find((n) => n.id === id))
    .filter((n): n is NoteNode => Boolean(n));

  if (tabs.length === 0) return null;

  return (
    <div
      className="flex items-center gap-1 px-2 py-1.5 overflow-x-auto"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            draggable
            onDragStart={() => (dragId.current = tab.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragId.current !== null) onReorder(dragId.current, tab.id);
              dragId.current = null;
            }}
            onClick={() => onActivate(tab.id)}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-t-xl cursor-pointer shrink-0 max-w-[200px]"
            style={{
              backgroundColor: isActive
                ? "var(--color-accent-primary)"
                : "transparent",
              color: isActive ? "#fff" : "var(--color-text-muted)",
              boxShadow: isActive ? "var(--shadow-neo-raised-sm)" : "none",
              fontSize: "12px",
            }}
            title={nodeTitle(tab)}
          >
            <span>📄</span>
            <span className="truncate">{nodeTitle(tab)}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose(tab.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              style={{ color: isActive ? "#fff" : "var(--color-text-muted)" }}
              title="Close tab"
            >
              ✕
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={onNew}
        className="px-2.5 py-1 rounded-lg text-sm cursor-pointer shrink-0"
        style={{
          boxShadow: "var(--shadow-neo-raised-sm)",
          color: "var(--color-text-muted)",
        }}
        title="New note (Ctrl+N)"
      >
        +
      </button>

      <button
        type="button"
        onClick={onCloseAll}
        className="ml-auto px-2.5 py-1 rounded-lg text-xs cursor-pointer shrink-0"
        style={{ color: "var(--color-text-muted)" }}
title="Close all tabs"
          >
            Close all
      </button>
    </div>
  );
}
