import { useNotes } from "../NotesProvider";

export function NotesFooter() {
  const { noteNodes } = useNotes();
  const notes = noteNodes.filter((n) => n.type === "NOTE").length;
  const folders = noteNodes.length - notes;

  return (
    <footer
      className="flex items-center justify-between px-3 py-2 text-xs"
      style={{ borderTop: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
    >
      <span className="truncate" title="Workspace">
        🗂 My workspace
      </span>
      <span title={`${folders} folders · ${notes} notes`}>
        {folderEmoji(folders)} {notes}
      </span>
    </footer>
  );
}

function folderEmoji(folders: number): string {
  return folders > 0 ? "📁" : "";
}
