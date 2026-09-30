import { useEffect } from "react";
import { useNotes } from "./NotesProvider";
import { TabBar } from "./components/TabBar";
import { NoteEditor } from "./components/NoteEditor";
import { SearchPalette } from "./components/SearchPalette";

export function NotesPage() {
  const {
    noteNodes,
    isLoading,
    openTabs,
    activeTabId,
    activeNote,
    backlinks,
    mode,
    searchOpen,
    saveToken,
    setSearchOpen,
    openNote,
    closeTab,
    closeAllTabs,
    activateTab,
    reorderTabs,
    newNote,
    toggleMode,
    save,
    openWikiLink,
    requestSave,
  } = useNotes();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      if (key === "n") {
        e.preventDefault();
        newNote();
      } else if (key === "s") {
        e.preventDefault();
        requestSave();
      } else if (key === "k" || key === "p") {
        e.preventDefault();
        setSearchOpen(true);
      } else if (key === "w") {
        if (activeTabId !== null) {
          e.preventDefault();
          closeTab(activeTabId);
        }
      } else if (key === "e") {
        e.preventDefault();
        toggleMode();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [newNote, requestSave, setSearchOpen, activeTabId, closeTab, toggleMode]);

  return (
    <div
      className="flex flex-col h-full w-full"
      style={{ backgroundColor: "var(--color-bg-surface)" }}
    >
      <TabBar
        nodes={noteNodes}
        openTabs={openTabs}
        activeTabId={activeTabId}
        onActivate={activateTab}
        onClose={closeTab}
        onCloseAll={closeAllTabs}
        onNew={newNote}
        onReorder={reorderTabs}
      />

      {isLoading && noteNodes.length === 0 ? (
        <div
          className="flex-1 flex items-center justify-center"
          style={{ color: "var(--color-text-muted)" }}
        >
          Cargando notas…
        </div>
      ) : (
        <NoteEditor
          key={activeNote?.id ?? "empty"}
          note={activeNote}
          save={save}
          mode={mode}
          onToggleMode={toggleMode}
          backlinks={backlinks}
          onOpenNote={openNote}
          onOpenWikiLink={openWikiLink}
          saveToken={saveToken}
        />
      )}

      <SearchPalette
        nodes={noteNodes}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenNote={openNote}
      />
    </div>
  );
}
