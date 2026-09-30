export interface WorkspaceSession {
  openTabs: number[];
  activeTabId: number | null;
  expandedFolders: number[];
  sortField: "name" | "createdAt" | "updatedAt";
  sortDirection: "asc" | "desc";
}

const STORAGE_KEY = "nonotion_notes_session";

export const defaultSession: WorkspaceSession = {
  openTabs: [],
  activeTabId: null,
  expandedFolders: [],
  sortField: "name",
  sortDirection: "asc",
};

export function loadSession(): WorkspaceSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSession;
    const parsed = JSON.parse(raw) as Partial<WorkspaceSession>;
    return {
      openTabs: Array.isArray(parsed.openTabs) ? parsed.openTabs : [],
      activeTabId:
        typeof parsed.activeTabId === "number" ? parsed.activeTabId : null,
      expandedFolders: Array.isArray(parsed.expandedFolders)
        ? parsed.expandedFolders
        : [],
      sortField: parsed.sortField ?? defaultSession.sortField,
      sortDirection: parsed.sortDirection ?? defaultSession.sortDirection,
    };
  } catch {
    return defaultSession;
  }
}

export function saveSession(session: WorkspaceSession) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore quota / privacy mode errors
  }
}
