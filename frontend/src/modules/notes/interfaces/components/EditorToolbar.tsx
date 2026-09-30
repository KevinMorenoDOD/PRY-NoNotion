import { useState } from "react";

export type FormatAction =
  | "h1"
  | "h2"
  | "h3"
  | "bold"
  | "italic"
  | "strike"
  | "bulletList"
  | "orderedList"
  | "taskList"
  | "link"
  | "wikiLink"
  | "code"
  | "quote";

interface EditorToolbarProps {
  onAction: (action: FormatAction) => void;
  onInsertTable: (rows: number, cols: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

interface ToolbarButton {
  action: FormatAction;
  label: string;
  title: string;
}

const buttons: ToolbarButton[] = [
  { action: "h1", label: "H1", title: "Heading 1" },
  { action: "h2", label: "H2", title: "Heading 2" },
  { action: "h3", label: "H3", title: "Heading 3" },
  { action: "bold", label: "B", title: "Bold (Ctrl+B)" },
  { action: "italic", label: "I", title: "Italic (Ctrl+I)" },
  { action: "strike", label: "S", title: "Strikethrough" },
  { action: "bulletList", label: "•", title: "Bullet list" },
  { action: "orderedList", label: "1.", title: "Numbered list" },
  { action: "taskList", label: "☑", title: "Task list" },
  { action: "quote", label: "❝", title: "Quote" },
  { action: "code", label: "</>", title: "Code block" },
  { action: "link", label: "🔗", title: "Link" },
  { action: "wikiLink", label: "[[]]", title: "Internal note link" },
];

export function EditorToolbar({
  onAction,
  onInsertTable,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: EditorToolbarProps) {
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(3);

  return (
    <div
      className="flex flex-wrap items-center gap-1 px-3 py-2"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        className="px-2 py-1 rounded-lg text-xs transition-all disabled:opacity-40"
        style={{ boxShadow: "var(--shadow-neo-raised-sm)", color: "var(--color-text-muted)" }}
      >
        ↶
      </button>
      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
        className="px-2 py-1 rounded-lg text-xs transition-all disabled:opacity-40"
        style={{ boxShadow: "var(--shadow-neo-raised-sm)", color: "var(--color-text-muted)" }}
      >
        ↷
      </button>

      <span className="mx-1 h-5 w-px" style={{ backgroundColor: "var(--color-border)" }} />

      {buttons.map((btn) => (
        <button
          key={btn.action}
          type="button"
          onClick={() => onAction(btn.action)}
          title={btn.title}
          className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          style={{
            boxShadow: "var(--shadow-neo-raised-sm)",
            color: "var(--color-text-primary)",
            minWidth: "30px",
          }}
          onMouseDown={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-neo-pressed-sm)")}
          onMouseUp={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-neo-raised-sm)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-neo-raised-sm)")}
        >
          {btn.label}
        </button>
      ))}

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowTableDialog((v) => !v)}
          title="Insert table"
          className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          style={{
            boxShadow: "var(--shadow-neo-raised-sm)",
            color: "var(--color-text-primary)",
          }}
        >
          ⊞ Table
        </button>

        {showTableDialog && (
          <div
            className="absolute z-30 mt-2 p-3 rounded-xl flex flex-col gap-2"
            style={{
              backgroundColor: "var(--color-bg-surface)",
              boxShadow: "var(--shadow-neo-elevated)",
              width: "200px",
            }}
          >
            <label className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Rows
              <input
                type="number"
                min={1}
                max={50}
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
                className="w-full mt-1 px-2 py-1 rounded-lg border-none outline-none"
                style={{ boxShadow: "var(--shadow-neo-pressed-sm)", backgroundColor: "var(--color-bg-surface)" }}
              />
            </label>
            <label className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Columns
              <input
                type="number"
                min={1}
                max={20}
                value={cols}
                onChange={(e) => setCols(Number(e.target.value))}
                className="w-full mt-1 px-2 py-1 rounded-lg border-none outline-none"
                style={{ boxShadow: "var(--shadow-neo-pressed-sm)", backgroundColor: "var(--color-bg-surface)" }}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                onInsertTable(rows, cols);
                setShowTableDialog(false);
              }}
              className="mt-1 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ backgroundColor: "var(--color-accent-primary)", color: "#fff" }}
            >
              Insert
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
