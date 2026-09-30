import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { NoteNode, SortDirection, SortField } from "../domain/NoteNode";
import { isFolder, nodeTitle } from "../domain/NoteNode";
import { NoteNodeType } from "../domain/NoteNodeType";
import { computeBacklinks } from "../domain/markdown";
import { useNoteNodes } from "../application/useNoteNodes";
import { useWorkspace } from "../application/useWorkspace";
import type { EditNoteNodeRequest } from "../infrastructure/notesApi";
import type { ApiError } from "@shared/domain/ApiError";

interface NotesContextValue {
  noteNodes: NoteNode[];
  isLoading: boolean;
  error: ApiError | null;
  openTabs: number[];
  activeTabId: number | null;
  activeNote: NoteNode | null;
  backlinks: NoteNode[];
  expandedFolders: number[];
  sortField: SortField;
  sortDirection: SortDirection;
  mode: "edit" | "read";
  searchOpen: boolean;
  selectedFolderId: number | null;
  saveToken: number;
  setMode: (mode: "edit" | "read") => void;
  toggleMode: () => void;
  setSearchOpen: (open: boolean) => void;
  setSelectedFolder: (id: number | null) => void;
  openNote: (id: number) => void;
  closeTab: (id: number) => void;
  closeAllTabs: () => void;
  activateTab: (id: number) => void;
  reorderTabs: (fromId: number, toId: number) => void;
  toggleFolder: (id: number) => void;
  expandAll: () => void;
  collapseAll: () => void;
  setSort: (field: SortField, direction: SortDirection) => void;
  createNode: (parentId: number | null, type: NoteNodeType) => Promise<void>;
  newNote: () => void;
  renameNode: (id: number, title: string) => Promise<unknown>;
  deleteNode: (id: number) => Promise<void>;
  moveNode: (id: number, parentId: number | null) => Promise<unknown>;
  save: (id: number, data: EditNoteNodeRequest) => Promise<unknown>;
  openWikiLink: (title: string) => Promise<void>;
  requestSave: () => void;
}

const NotesContext = createContext<NotesContextValue | null>(null);

function descendantIds(all: NoteNode[], rootId: number): number[] {
  const ids: number[] = [];
  const stack = [rootId];
  while (stack.length) {
    const current = stack.pop()!;
    for (const node of all) {
      if (node.parentId === current) {
        ids.push(node.id);
        stack.push(node.id);
      }
    }
  }
  return ids;
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const {
    noteNodes,
    isLoading,
    error,
    createNoteNode,
    editNoteNode,
    deleteNoteNode,
    moveNoteNode,
    renameNoteNode,
  } = useNoteNodes();

  const workspace = useWorkspace(noteNodes);
  const [mode, setMode] = useState<"edit" | "read">("edit");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedFolderId, setSelectedFolder] = useState<number | null>(null);
  const [saveToken, setSaveToken] = useState(0);

  const activeNote = useMemo(
    () => noteNodes.find((n) => n.id === workspace.activeTabId) ?? null,
    [noteNodes, workspace.activeTabId]
  );

  const backlinks = useMemo(
    () => computeBacklinks(noteNodes, activeNote),
    [noteNodes, activeNote]
  );

  const openNote = useCallback(
    (id: number) => {
      workspace.openNote(id);
      setMode("edit");
    },
    [workspace]
  );

  const createNode = useCallback(
    async (parentId: number | null, type: NoteNodeType) => {
      const created = await createNoteNode({
        parentId,
        type,
        title: type === NoteNodeType.FOLDER ? "New folder" : "Untitled note",
        content: type === NoteNodeType.NOTE ? "" : undefined,
      });
      if (type === NoteNodeType.NOTE) {
        workspace.openNote(created.id);
        setMode("edit");
      }
    },
    [createNoteNode, workspace]
  );

  const newNote = useCallback(() => {
    const parentId = activeNote ? activeNote.parentId : selectedFolderId;
    void createNode(parentId, NoteNodeType.NOTE);
  }, [activeNote, selectedFolderId, createNode]);

  const deleteNode = useCallback(
    async (id: number) => {
      const node = noteNodes.find((n) => n.id === id);
      const idsToClose =
        node && isFolder(node) ? [id, ...descendantIds(noteNodes, id)] : [id];
      await deleteNoteNode(id);
      idsToClose.forEach((closeId) => {
        if (workspace.openTabs.includes(closeId)) workspace.closeTab(closeId);
      });
    },
    [noteNodes, deleteNoteNode, workspace]
  );

  const openWikiLink = useCallback(
    async (title: string) => {
      const existing = noteNodes.find(
        (n) => !isFolder(n) && nodeTitle(n).toLowerCase() === title.toLowerCase()
      );
      if (existing) {
        openNote(existing.id);
        return;
      }
      const created = await createNoteNode({
        parentId: null,
        type: NoteNodeType.NOTE,
        title,
        content: "",
      });
      openNote(created.id);
    },
    [noteNodes, createNoteNode, openNote]
  );

  const toggleMode = useCallback(
    () => setMode((m) => (m === "edit" ? "read" : "edit")),
    []
  );

  const requestSave = useCallback(() => setSaveToken((t) => t + 1), []);

  const value: NotesContextValue = {
    noteNodes,
    isLoading,
    error,
    openTabs: workspace.openTabs,
    activeTabId: workspace.activeTabId,
    activeNote,
    backlinks,
    expandedFolders: workspace.expandedFolders,
    sortField: workspace.sortField,
    sortDirection: workspace.sortDirection,
    mode,
    searchOpen,
    selectedFolderId,
    saveToken,
    setMode,
    toggleMode,
    setSearchOpen,
    setSelectedFolder,
    openNote,
    closeTab: workspace.closeTab,
    closeAllTabs: workspace.closeAllTabs,
    activateTab: workspace.activateTab,
    reorderTabs: workspace.reorderTabs,
    toggleFolder: workspace.toggleFolder,
    expandAll: workspace.expandAllFolders,
    collapseAll: workspace.collapseAllFolders,
    setSort: workspace.setSort,
    createNode,
    newNote,
    renameNode: renameNoteNode,
    deleteNode,
    moveNode: moveNoteNode,
    save: editNoteNode,
    openWikiLink,
    requestSave,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}
