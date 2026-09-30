import { useCallback, useEffect, useMemo, useState } from "react";
import type { NoteNode, SortDirection, SortField } from "../domain/NoteNode";
import { isFolder } from "../domain/NoteNode";
import {
  loadSession,
  saveSession,
  type WorkspaceSession,
} from "../infrastructure/workspaceStorage";

export function useWorkspace(allNodes: NoteNode[]) {
  const [session, setSession] = useState<WorkspaceSession>(() => loadSession());

  const validNoteIds = useMemo(
    () => new Set(allNodes.filter((n) => !isFolder(n)).map((n) => n.id)),
    [allNodes]
  );
  const folderIds = useMemo(
    () => allNodes.filter(isFolder).map((n) => n.id),
    [allNodes]
  );

  useEffect(() => {
    saveSession(session);
  }, [session]);

  useEffect(() => {
    if (allNodes.length === 0) return;
    setSession((prev) => {
      const openTabs = prev.openTabs.filter((id) => validNoteIds.has(id));
      let activeTabId = prev.activeTabId;
      if (activeTabId !== null && !validNoteIds.has(activeTabId)) {
        activeTabId = openTabs.length > 0 ? openTabs[openTabs.length - 1] : null;
      }
      const expandedFolders = prev.expandedFolders.filter((id) =>
        folderIds.includes(id)
      );
      const changed =
        openTabs.length !== prev.openTabs.length ||
        activeTabId !== prev.activeTabId ||
        expandedFolders.length !== prev.expandedFolders.length;
      return changed ? { ...prev, openTabs, activeTabId, expandedFolders } : prev;
    });
  }, [allNodes.length, validNoteIds, folderIds]);

  const openNote = useCallback((id: number) => {
    setSession((prev) => ({
      ...prev,
      openTabs: prev.openTabs.includes(id)
        ? prev.openTabs
        : [...prev.openTabs, id],
      activeTabId: id,
    }));
  }, []);

  const closeTab = useCallback((id: number) => {
    setSession((prev) => {
      const index = prev.openTabs.indexOf(id);
      const openTabs = prev.openTabs.filter((tabId) => tabId !== id);
      let activeTabId = prev.activeTabId;
      if (prev.activeTabId === id) {
        activeTabId =
          openTabs[index] ?? openTabs[index - 1] ?? openTabs[0] ?? null;
      }
      return { ...prev, openTabs, activeTabId };
    });
  }, []);

  const closeAllTabs = useCallback(() => {
    setSession((prev) => ({ ...prev, openTabs: [], activeTabId: null }));
  }, []);

  const activateTab = useCallback((id: number) => {
    setSession((prev) => ({ ...prev, activeTabId: id }));
  }, []);

  const reorderTabs = useCallback((fromId: number, toId: number) => {
    setSession((prev) => {
      const from = prev.openTabs.indexOf(fromId);
      const to = prev.openTabs.indexOf(toId);
      if (from === -1 || to === -1 || from === to) return prev;
      const openTabs = prev.openTabs.slice();
      const [moved] = openTabs.splice(from, 1);
      openTabs.splice(to, 0, moved);
      return { ...prev, openTabs };
    });
  }, []);

  const toggleFolder = useCallback((id: number) => {
    setSession((prev) => ({
      ...prev,
      expandedFolders: prev.expandedFolders.includes(id)
        ? prev.expandedFolders.filter((folderId) => folderId !== id)
        : [...prev.expandedFolders, id],
    }));
  }, []);

  const setFolderExpanded = useCallback((id: number, expanded: boolean) => {
    setSession((prev) => {
      const has = prev.expandedFolders.includes(id);
      if (expanded && !has) {
        return { ...prev, expandedFolders: [...prev.expandedFolders, id] };
      }
      if (!expanded && has) {
        return {
          ...prev,
          expandedFolders: prev.expandedFolders.filter((f) => f !== id),
        };
      }
      return prev;
    });
  }, []);

  const expandAllFolders = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      expandedFolders: folderIds.slice(),
    }));
  }, [folderIds]);

  const collapseAllFolders = useCallback(() => {
    setSession((prev) => ({ ...prev, expandedFolders: [] }));
  }, []);

  const setSort = useCallback(
    (sortField: SortField, sortDirection: SortDirection) => {
      setSession((prev) => ({ ...prev, sortField, sortDirection }));
    },
    []
  );

  return {
    openTabs: session.openTabs,
    activeTabId: session.activeTabId,
    expandedFolders: session.expandedFolders,
    sortField: session.sortField,
    sortDirection: session.sortDirection,
    openNote,
    closeTab,
    closeAllTabs,
    activateTab,
    reorderTabs,
    toggleFolder,
    setFolderExpanded,
    expandAllFolders,
    collapseAllFolders,
    setSort,
  };
}
