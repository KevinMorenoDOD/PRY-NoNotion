import { useState } from "react";
import { NoteNodeType } from "../../domain/NoteNodeType";
import type { SortField } from "../../domain/NoteNode";
import { useNotes } from "../NotesProvider";

const sortLabels: Record<SortField, string> = {
  name: "Name",
  createdAt: "Created",
  updatedAt: "Modified",
};

export function NotesActions() {
  const {
    selectedFolderId,
    createNode,
    sortField,
    sortDirection,
    setSort,
    expandAll,
    collapseAll,
  } = useNotes();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          title="Create"
          aria-label="Create"
          className="w-6 h-6 flex items-center justify-center rounded-lg cursor-pointer text-sm"
          style={{ boxShadow: "var(--shadow-neo-raised-sm)", color: "var(--color-text-primary)" }}
        >
          ＋
        </button>
        {menuOpen && (
          <div
            className="absolute right-0 z-40 mt-1 p-1.5 rounded-xl flex flex-col gap-0.5"
            style={{
              backgroundColor: "var(--color-bg-surface)",
              boxShadow: "var(--shadow-neo-elevated)",
              width: "160px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                void createNode(selectedFolderId, NoteNodeType.NOTE);
                setMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg text-xs cursor-pointer"
              style={{ color: "var(--color-text-primary)" }}
            >
              📄 New note
            </button>
            <button
              type="button"
              onClick={() => {
                void createNode(selectedFolderId, NoteNodeType.FOLDER);
                setMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg text-xs cursor-pointer"
              style={{ color: "var(--color-text-primary)" }}
            >
              📁 New folder
            </button>
          </div>
        )}
      </div>

      <select
        value={sortField}
        onChange={(e) => setSort(e.target.value as SortField, sortDirection)}
        title="Sort by"
        className="h-6 px-1 rounded-lg border-none outline-none cursor-pointer text-xs"
        style={{ backgroundColor: "var(--color-surface-soft)", color: "var(--color-text-muted)" }}
      >
        {(Object.keys(sortLabels) as SortField[]).map((field) => (
          <option key={field} value={field}>
            {sortLabels[field]}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() =>
          setSort(sortField, sortDirection === "asc" ? "desc" : "asc")
        }
        title="Direction"
        aria-label="Direction"
        className="w-6 h-6 flex items-center justify-center rounded-lg cursor-pointer text-xs"
        style={{ boxShadow: "var(--shadow-neo-raised-sm)", color: "var(--color-text-muted)" }}
      >
        {sortDirection === "asc" ? "↑" : "↓"}
      </button>

      <button
        type="button"
        onClick={expandAll}
        title="Expand all"
        aria-label="Expand all"
        className="w-6 h-6 flex items-center justify-center rounded-lg cursor-pointer text-xs"
        style={{ boxShadow: "var(--shadow-neo-raised-sm)", color: "var(--color-text-muted)" }}
      >
        ⊞
      </button>
      <button
        type="button"
        onClick={collapseAll}
        title="Collapse all"
        aria-label="Collapse all"
        className="w-6 h-6 flex items-center justify-center rounded-lg cursor-pointer text-xs"
        style={{ boxShadow: "var(--shadow-neo-raised-sm)", color: "var(--color-text-muted)" }}
      >
        ⊟
      </button>
    </>
  );
}
