import { useEffect, useRef } from "react";
import type { NoteNode } from "../../domain/NoteNode";
import type { EditNoteNodeRequest } from "../../infrastructure/notesApi";
import { useNoteEditor } from "../../application/useNoteEditor";
import {
  buildTable,
  countChars,
  countWords,
  insertBlock,
  toggleLinePrefix,
  toggleWrap,
  wrapSelection,
  type TextSelection,
} from "../../domain/markdown";
import { EditorToolbar, type FormatAction } from "./EditorToolbar";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { StatusBar } from "./StatusBar";

interface NoteEditorProps {
  note: NoteNode | null;
  save: (id: number, data: EditNoteNodeRequest) => Promise<unknown>;
  mode: "edit" | "read";
  onToggleMode: () => void;
  backlinks: NoteNode[];
  onOpenNote: (id: number) => void;
  onOpenWikiLink: (title: string) => void;
  saveToken?: number;
}

export function NoteEditor({
  note,
  save,
  mode,
  onToggleMode,
  backlinks,
  onOpenNote,
  onOpenWikiLink,
  saveToken = 0,
}: NoteEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    title,
    content,
    status,
    changeTitle,
    changeContent,
    saveNow,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useNoteEditor({ note, save });

  useEffect(() => {
    if (saveToken > 0) {
      void saveNow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveToken]);

  if (!note) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center gap-3"
        style={{ color: "var(--color-text-muted)" }}
      >
        <span className="text-5xl">📝</span>
        <p className="text-sm">
          Select a note from the explorer or create a new one.
        </p>
      </div>
    );
  }

  const applyResult = (result: {
    value: string;
    selectionStart: number;
    selectionEnd: number;
  }) => {
    changeContent(result.value);
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (ta) {
        ta.focus();
        ta.setSelectionRange(result.selectionStart, result.selectionEnd);
      }
    });
  };

  const applyFormat = (action: FormatAction) => {
    const ta = textareaRef.current;
    const sel: TextSelection = ta
      ? {
          value: content,
          selectionStart: ta.selectionStart,
          selectionEnd: ta.selectionEnd,
        }
      : { value: content, selectionStart: content.length, selectionEnd: content.length };

    switch (action) {
      case "h1":
        applyResult(toggleLinePrefix(sel, "# "));
        break;
      case "h2":
        applyResult(toggleLinePrefix(sel, "## "));
        break;
      case "h3":
        applyResult(toggleLinePrefix(sel, "### "));
        break;
      case "bold":
        applyResult(toggleWrap(sel, "**"));
        break;
      case "italic":
        applyResult(toggleWrap(sel, "*"));
        break;
      case "strike":
        applyResult(toggleWrap(sel, "~~"));
        break;
      case "bulletList":
        applyResult(toggleLinePrefix(sel, "- "));
        break;
      case "orderedList":
        applyResult(toggleLinePrefix(sel, "1. "));
        break;
      case "taskList":
        applyResult(toggleLinePrefix(sel, "- [ ] "));
        break;
      case "quote":
        applyResult(toggleLinePrefix(sel, "> "));
        break;
      case "code":
        applyResult(insertBlock(sel, "```\n\n```"));
        break;
      case "link":
        applyResult(wrapSelection(sel, "[", "](url)"));
        break;
      case "wikiLink":
        applyResult(wrapSelection(sel, "[[", "]]"));
        break;
      default:
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      applyFormat("bold");
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
      e.preventDefault();
      applyFormat("italic");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div
        className="flex items-center gap-3 px-5 py-3"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <input
          value={title}
          onChange={(e) => changeTitle(e.target.value)}
          onBlur={() => void saveNow()}
          placeholder="Note title"
          className="flex-1 bg-transparent border-none outline-none font-semibold text-lg"
          style={{ color: "var(--color-heading)" }}
        />
        <button
          type="button"
          onClick={onToggleMode}
          className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
          style={{
            backgroundColor: mode === "read" ? "var(--color-accent-primary)" : "transparent",
            color: mode === "read" ? "#fff" : "var(--color-text-primary)",
            boxShadow: "var(--shadow-neo-raised-sm)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {mode === "read" ? "Read" : "Edit"}
        </button>
      </div>

      {mode === "edit" && (
        <EditorToolbar
          onAction={applyFormat}
          onInsertTable={(rows, cols) => {
            const ta = textareaRef.current;
            const sel: TextSelection = ta
              ? {
                  value: content,
                  selectionStart: ta.selectionStart,
                  selectionEnd: ta.selectionEnd,
                }
              : { value: content, selectionStart: content.length, selectionEnd: content.length };
            applyResult(insertBlock(sel, buildTable(rows, cols)));
          }}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      )}

      <div className="flex-1 min-h-0 overflow-hidden">
        {mode === "edit" ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => changeContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => void saveNow()}
            placeholder="Write in Markdown… Use [[Title of another note]] to link notes, and Table to insert tables."
            spellCheck={false}
            className="w-full h-full resize-none border-none outline-none px-6 py-5"
            style={{
              backgroundColor: "transparent",
              color: "var(--color-text-primary)",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              fontSize: "14px",
              lineHeight: 1.7,
            }}
          />
        ) : (
          <div className="w-full h-full overflow-y-auto px-6 py-5">
            <MarkdownRenderer
              content={content}
              onOpenWikiLink={onOpenWikiLink}
            />
          </div>
        )}
      </div>

      <StatusBar
        words={countWords(content)}
        chars={countChars(content)}
        backlinks={backlinks}
        mode={mode}
        status={status}
        onOpenBacklink={onOpenNote}
      />
    </div>
  );
}
