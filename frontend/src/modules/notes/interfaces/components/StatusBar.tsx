import { useState } from "react";
import type { NoteNode } from "../../domain/NoteNode";
import { nodeTitle } from "../../domain/NoteNode";
import type { SaveStatus } from "../../application/useNoteEditor";

interface StatusBarProps {
  words: number;
  chars: number;
  backlinks: NoteNode[];
  mode: "edit" | "read";
  status: SaveStatus;
  onOpenBacklink: (id: number) => void;
}

const statusConfig: Record<SaveStatus, { label: string; color: string }> = {
  idle: { label: "Saved", color: "var(--color-text-muted)" },
  saved: { label: "Saved", color: "var(--color-success)" },
  dirty: { label: "Unsaved", color: "var(--color-text-muted)" },
  saving: { label: "Saving…", color: "var(--color-accent-primary)" },
  error: { label: "Save error", color: "var(--color-danger)" },
};

export function StatusBar({
  words,
  chars,
  backlinks,
  mode,
  status,
  onOpenBacklink,
}: StatusBarProps) {
  const [showBacklinks, setShowBacklinks] = useState(false);
  const cfg = statusConfig[status];

  return (
    <div
      className="relative flex items-center gap-4 px-4 py-1.5 text-xs"
      style={{
        borderTop: "1px solid var(--color-border)",
        color: "var(--color-text-muted)",
      }}
    >
      <span>{words} words</span>
      <span>{chars} chars</span>

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowBacklinks((v) => !v)}
          className="cursor-pointer"
          style={{ color: backlinks.length > 0 ? "var(--color-accent-primary)" : "var(--color-text-muted)" }}
        >
          {backlinks.length} backlinks
        </button>
        {showBacklinks && backlinks.length > 0 && (
          <div
            className="absolute bottom-7 left-0 z-30 p-2 rounded-xl flex flex-col gap-1 max-h-56 overflow-y-auto"
            style={{
              backgroundColor: "var(--color-bg-surface)",
              boxShadow: "var(--shadow-neo-elevated)",
              width: "240px",
            }}
          >
            {backlinks.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => {
                  onOpenBacklink(node.id);
                  setShowBacklinks(false);
                }}
                className="text-left px-3 py-2 rounded-lg truncate cursor-pointer"
                style={{ color: "var(--color-text-primary)" }}
              >
                📄 {nodeTitle(node)}
              </button>
            ))}
          </div>
        )}
      </div>

      <span className="ml-auto uppercase tracking-wide" style={{ fontSize: "10px" }}>
        {mode === "edit" ? "Edit" : "Read"}
      </span>
      <span className="flex items-center gap-1.5" style={{ color: cfg.color }}>
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ backgroundColor: cfg.color }}
        />
        {cfg.label}
      </span>
    </div>
  );
}
