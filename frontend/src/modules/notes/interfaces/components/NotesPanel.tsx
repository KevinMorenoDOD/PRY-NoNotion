import { useMemo, useState } from "react";
import type { NoteNode } from "../../domain/NoteNode";
import { isFolder, nodeTitle } from "../../domain/NoteNode";
import { NoteNodeType } from "../../domain/NoteNodeType";
import { useNotes } from "../NotesProvider";

interface DragState {
  draggingId: number | null;
  dragOverId: number | null;
}

export function NotesPanel() {
  const {
    noteNodes,
    activeTabId,
    expandedFolders,
    toggleFolder,
    sortField,
    sortDirection,
    selectedFolderId,
    setSelectedFolder,
    createNode,
    renameNode,
    deleteNode,
    moveNode,
    openNote,
  } = useNotes();

  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [dragState, setDragState] = useState<DragState>({
    draggingId: null,
    dragOverId: null,
  });

  const nodeById = useMemo(() => {
    const map = new Map<number, NoteNode>();
    noteNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [noteNodes]);

  const sortList = (list: NoteNode[]) =>
    [...list].sort((a, b) => {
      if (isFolder(a) !== isFolder(b)) return isFolder(a) ? -1 : 1;
      let cmp = 0;
      if (sortField === "name") cmp = nodeTitle(a).localeCompare(nodeTitle(b));
      else if (sortField === "createdAt")
        cmp = a.createdAt.localeCompare(b.createdAt);
      else cmp = a.updatedAt.localeCompare(b.updatedAt);
      return sortDirection === "asc" ? cmp : -cmp;
    });

  const childrenOf = (parentId: number | null) =>
    sortList(noteNodes.filter((n) => n.parentId === parentId));

  const isExpanded = (id: number) => expandedFolders.includes(id);

  const canDropOn = (dragId: number, targetId: number | null): boolean => {
    if (targetId === null) {
      const dragged = nodeById.get(dragId);
      return dragged ? dragged.parentId !== null : false;
    }
    if (dragId === targetId) return false;
    let current: number | null = targetId;
    while (current !== null) {
      if (current === dragId) return false;
      current = nodeById.get(current)?.parentId ?? null;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent, targetId: number | null) => {
    e.preventDefault();
    const dragId = Number(e.dataTransfer.getData("text/plain"));
    const dragged = nodeById.get(dragId);
    if (dragged && canDropOn(dragId, targetId) && dragged.parentId !== targetId) {
      void moveNode(dragId, targetId);
    }
    setDragState({ draggingId: null, dragOverId: null });
  };

  const commitRename = () => {
    if (renamingId !== null && renameValue.trim()) {
      void renameNode(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const renderNode = (node: NoteNode, depth: number): React.ReactNode => {
    const folder = isFolder(node);
    const selected = selectedFolderId === node.id;
    const active = activeTabId === node.id;
    const dragged = dragState.draggingId === node.id;
    const dragOver = dragState.dragOverId === node.id;
    const canDrop =
      dragState.draggingId !== null && canDropOn(dragState.draggingId, node.id);
    const expanded = folder && isExpanded(node.id);
    const kids = folder && expanded ? childrenOf(node.id) : [];
    const isRenaming = renamingId === node.id;

    const background = active
      ? "var(--color-accent-primary)"
      : dragOver && canDrop
        ? "var(--color-accent-light)"
        : selected
          ? "var(--color-surface-soft)"
          : "transparent";
    const color = active ? "#fff" : "var(--color-text-primary)";

    return (
      <div key={node.id}>
        <div
          draggable={!isRenaming}
          onDragStart={(e) => {
            e.dataTransfer.setData("text/plain", String(node.id));
            e.dataTransfer.effectAllowed = "move";
            setDragState({ draggingId: node.id, dragOverId: null });
          }}
          onDragOver={(e) => {
            if (folder) {
              e.preventDefault();
              e.stopPropagation();
              if (canDrop) setDragState((p) => ({ ...p, dragOverId: node.id }));
            }
          }}
          onDrop={(e) => {
            if (folder) {
              e.stopPropagation();
              handleDrop(e, node.id);
            }
          }}
          onDragEnd={() => setDragState({ draggingId: null, dragOverId: null })}
          onClick={(e) => {
            e.stopPropagation();
            if (folder) {
              toggleFolder(node.id);
              setSelectedFolder(node.id);
            } else {
              openNote(node.id);
            }
          }}
          className="group flex items-center gap-1.5 pr-1.5 rounded-lg cursor-pointer"
          style={{
            paddingLeft: `${depth * 14 + 6}px`,
            paddingTop: "6px",
            paddingBottom: "6px",
            backgroundColor: background,
            color,
            opacity: dragged ? 0.45 : 1,
            boxShadow: dragOver && canDrop ? "var(--shadow-neo-elevated)" : "none",
            fontSize: "13px",
          }}
        >
          <span
            className="w-4 text-center shrink-0"
            style={{ fontSize: "10px", opacity: folder ? 0.8 : 0 }}
            onClick={(e) => {
              if (folder) {
                e.stopPropagation();
                toggleFolder(node.id);
              }
            }}
          >
            {expanded ? "▼" : "▶"}
          </span>
          <span className="shrink-0">{folder ? (expanded ? "📂" : "📁") : "📄"}</span>

          {isRenaming ? (
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setRenamingId(null);
              }}
              className="flex-1 min-w-0 bg-transparent border-none outline-none"
              style={{ color: "inherit", fontSize: "13px" }}
            />
          ) : (
            <span className="flex-1 min-w-0 truncate">{nodeTitle(node)}</span>
          )}

          <span className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity shrink-0">
            {folder && (
              <button
                type="button"
                title="New note in this folder"
                onClick={(e) => {
                  e.stopPropagation();
                  void createNode(node.id, NoteNodeType.NOTE);
                  if (!isExpanded(node.id)) toggleFolder(node.id);
                }}
                className="px-1 rounded cursor-pointer"
              >
                ＋
              </button>
            )}
            <button
              type="button"
              title="Rename"
              onClick={(e) => {
                e.stopPropagation();
                setRenamingId(node.id);
                setRenameValue(node.title);
              }}
              className="px-1 rounded cursor-pointer"
            >
              ✎
            </button>
            <button
              type="button"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                if (
                  window.confirm(
                    folder
                      ? "Delete this folder and its contents?"
                      : "Delete this note?"
                  )
                ) {
                  void deleteNode(node.id);
                }
              }}
              className="px-1 rounded cursor-pointer"
            >
              🗑
            </button>
          </span>
        </div>

        {folder && expanded && kids.length > 0 && (
          <div>{kids.map((child) => renderNode(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  const roots = childrenOf(null);

  return (
    <div
      className="h-full overflow-y-auto px-1.5 pb-4"
      onClick={() => setSelectedFolder(null)}
      onDragOver={(e) => {
        if (dragState.draggingId !== null && canDropOn(dragState.draggingId, null)) {
          e.preventDefault();
          setDragState((p) => ({ ...p, dragOverId: null }));
        }
      }}
      onDrop={(e) => handleDrop(e, null)}
    >
      {roots.length === 0 && (
        <p
          className="px-3 py-6 text-xs text-center"
          style={{ color: "var(--color-text-muted)" }}
        >
          No notes yet. Use ＋ in the action bar.
        </p>
      )}
      {roots.map((node) => renderNode(node, 0))}
    </div>
  );
}
