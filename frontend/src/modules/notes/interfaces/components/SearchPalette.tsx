import { useEffect, useRef, useState } from "react";
import type { NoteNode } from "../../domain/NoteNode";
import { nodeTitle } from "../../domain/NoteNode";
import { useNoteSearch } from "../../application/useNoteSearch";

interface SearchPaletteProps {
  nodes: NoteNode[];
  open: boolean;
  onClose: () => void;
  onOpenNote: (id: number) => void;
}

export function SearchPalette({
  nodes,
  open,
  onClose,
  onOpenNote,
}: SearchPaletteProps) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useNoteSearch(nodes, query);

  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlight(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  if (!open) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && results[highlight]) {
      onOpenNote(results[highlight].node.id);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
      style={{ backgroundColor: "rgba(45,52,54,0.35)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: "var(--color-bg-surface)",
          boxShadow: "var(--shadow-neo-elevated)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by title or content…"
          className="w-full px-5 py-4 border-none outline-none bg-transparent text-base"
          style={{ color: "var(--color-text-primary)", borderBottom: "1px solid var(--color-border)" }}
        />

        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim() === "" && (
            <p className="px-3 py-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Type to search your notes.
            </p>
          )}
          {query.trim() !== "" && results.length === 0 && (
            <p className="px-3 py-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
              No results.
            </p>
          )}
          {results.map((result, index) => (
            <button
              key={result.node.id}
              type="button"
              onMouseEnter={() => setHighlight(index)}
              onClick={() => {
                onOpenNote(result.node.id);
                onClose();
              }}
              className="w-full text-left px-3 py-2 rounded-xl flex flex-col gap-0.5 cursor-pointer"
              style={{
                backgroundColor:
                  index === highlight ? "var(--color-surface-soft)" : "transparent",
              }}
            >
              <span className="text-sm font-medium truncate" style={{ color: "var(--color-text-primary)" }}>
                📄 {nodeTitle(result.node)}
              </span>
              <span
                className="text-xs truncate"
                style={{ color: "var(--color-text-muted)" }}
              >
                {result.matchIn === "title" ? "Matches in title" : result.excerpt}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
