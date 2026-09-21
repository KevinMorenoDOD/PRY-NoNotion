import { useState, type DragEvent, type FormEvent } from "react";
import type { TaskList } from "../../domain/TaskList";

interface TaskListsSidebarProps {
  taskLists: TaskList[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onCreate: (name: string, color?: string) => void;
  onDelete: (id: number) => void;
  onDropTask: (taskId: number, listId: number) => void;
}

const LIST_COLORS = [
  "#008c9e",
  "#00b4cc",
  "#2f9e44",
  "#e67e22",
  "#c0392b",
  "#8e44ad",
  "#2980b9",
  "#d81b60",
];

export function TaskListsSidebar({
  taskLists,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
  onDropTask,
}: TaskListsSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [newColor, setNewColor] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showCascade, setShowCascade] = useState(false);

  const activeList =
    selectedId === null
      ? null
      : taskLists.find((list) => list.id === selectedId) ?? null;
  const activeName = activeList ? activeList.name : "All Tasks";
  const activeColor = activeList?.color || "var(--color-accent-primary)";

  const cascadeOptions = [
    { id: null as number | null, name: "All Tasks", color: null as string | null },
    ...taskLists.map((list) => ({
      id: list.id as number | null,
      name: list.name,
      color: list.color,
    })),
  ];

  const handleDragOver = (e: DragEvent, listId: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(listId);
  };

  const handleDrop = (e: DragEvent, listId: number) => {
    e.preventDefault();
    setDragOverId(null);
    const taskId = Number(e.dataTransfer.getData("text/plain"));
    if (taskId) onDropTask(taskId, listId);
  };

  const handleSelect = (id: number | null) => {
    onSelect(id);
    setShowCascade(false);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsCreating(true);
    onCreate(newName.trim(), newColor ?? undefined);
    setNewName("");
    setNewColor(null);
    setIsFormOpen(false);
    setIsCreating(false);
  };

  const handleCancelCreate = () => {
    setNewName("");
    setNewColor(null);
    setIsFormOpen(false);
  };

  return (
    <div
      className="h-full min-h-0 flex flex-col shrink-0 relative z-30 transition-[width] duration-200"
      style={{
        width: isOpen ? "14rem" : "3.5rem",
        backgroundColor: "var(--color-bg-surface)",
        boxShadow: "6px 0 14px rgba(45, 52, 54, 0.08)",
        padding: isOpen ? "1rem" : "0.75rem",
      }}
    >
      <div
        className={`flex items-center mb-4 shrink-0 ${
          isOpen ? "justify-between" : "justify-center"
        }`}
      >
        {isOpen && (
          <h2
            className="font-medium truncate"
            style={{
              color: "var(--color-heading)",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Task Lists
          </h2>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          title={isOpen ? "Collapse" : "Expand"}
          className="px-2 py-1 rounded-lg cursor-pointer transition-all duration-200 shrink-0"
          style={{
            color: "var(--color-heading)",
            boxShadow: "var(--shadow-neo-raised-sm)",
            fontSize: "12px",
            lineHeight: 1,
          }}
        >
          {isOpen ? "«" : "»"}
        </button>
      </div>

      {isOpen && (
        <>
          <button
            onClick={() => handleSelect(null)}
            className="w-full px-3 py-2 rounded-xl mb-3 text-left transition-all duration-200 cursor-pointer shrink-0"
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              ...(selectedId === null
                ? {
                    backgroundColor: "var(--color-accent-primary)",
                    color: "#ffffff",
                    boxShadow: "var(--shadow-neo-elevated)",
                  }
                : {
                    color: "var(--color-text-muted)",
                    boxShadow: "var(--shadow-neo-raised-sm)",
                  }),
            }}
          >
            All Tasks
          </button>

          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 px-2.5 py-2">
            {taskLists.map((list) => {
              const isSelected = selectedId === list.id;
              const isDragOver = dragOverId === list.id;
              return (
                <div
                  key={list.id}
                  onDragOver={(e) => handleDragOver(e, list.id)}
                  onDragLeave={() =>
                    setDragOverId((id) => (id === list.id ? null : id))
                  }
                  onDrop={(e) => handleDrop(e, list.id)}
                  className="flex items-center rounded-xl overflow-hidden shrink-0 transition-all duration-200"
                  style={{
                    backgroundColor: isSelected
                      ? list.color || "var(--color-accent-primary)"
                      : "var(--color-bg-surface)",
                    boxShadow: isSelected
                      ? "var(--shadow-neo-elevated)"
                      : "var(--shadow-neo-raised-sm)",
                    outline: isDragOver
                      ? "2px dashed var(--color-accent-primary)"
                      : "none",
                    outlineOffset: "2px",
                  }}
                >
                  <button
                    onClick={() => onSelect(list.id)}
                    className="flex-1 min-w-0 px-3 py-2 text-left cursor-pointer truncate"
                    style={{
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: isSelected
                        ? "#ffffff"
                        : list.color || "var(--color-text-muted)",
                    }}
                  >
                    {list.name}
                  </button>
                  <button
                    onClick={() => onDelete(list.id)}
                    title="Delete list"
                    className="px-2 py-2 cursor-pointer shrink-0 opacity-60 transition-opacity duration-200 hover:opacity-100"
                    style={{
                      color: isSelected ? "#ffffff" : "var(--color-danger)",
                      fontSize: "10px",
                    }}
                  >
                    x
                  </button>
                </div>
              );
            })}
          </div>

          {!isFormOpen ? (
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="mt-4 w-full px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 shrink-0"
              style={{
                color: "var(--color-text-muted)",
                boxShadow: "var(--shadow-neo-raised-sm)",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              + New list
            </button>
          ) : (
            <form onSubmit={handleCreate} className="mt-4 shrink-0 flex flex-col gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New list"
                autoFocus
                className="w-full min-w-0 px-3 py-2 rounded-xl border-none outline-none text-sm transition-colors duration-150"
                style={{
                  backgroundColor: newColor
                    ? newColor
                    : "var(--color-bg-surface)",
                  color: newColor ? "#ffffff" : "var(--color-text-primary)",
                  boxShadow: "var(--shadow-neo-pressed-sm)",
                }}
              />
              <div className="flex flex-wrap items-center gap-1.5">
                {LIST_COLORS.map((c) => {
                  const isPicked = newColor === c;
                  return (
                    <button
                      type="button"
                      key={c}
                      title={c}
                      onClick={() => setNewColor(isPicked ? null : c)}
                      className="w-5 h-5 rounded-full cursor-pointer transition-transform duration-150 shrink-0"
                      style={{
                        backgroundColor: c,
                        transform: isPicked ? "scale(1.15)" : "scale(1)",
                        boxShadow: isPicked
                          ? `0 0 0 2px var(--color-bg-surface), 0 0 0 3px ${c}`
                          : "var(--shadow-neo-raised-sm)",
                      }}
                    />
                  );
                })}
                <label
                  title="Custom color"
                  className="relative w-5 h-5 rounded-full flex items-center justify-center cursor-pointer shrink-0 transition-transform duration-150"
                  style={{
                    color: "var(--color-text-muted)",
                    boxShadow:
                      newColor && !LIST_COLORS.includes(newColor)
                        ? `0 0 0 2px var(--color-bg-surface), 0 0 0 3px ${newColor}`
                        : "var(--shadow-neo-raised-sm)",
                    transform:
                      newColor && !LIST_COLORS.includes(newColor)
                        ? "scale(1.15)"
                        : "scale(1)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.66 0 3-1.34 3-3 0-.55-.22-1.05-.59-1.41-.36-.37-.58-.87-.58-1.42 0-1.1.9-2 2-2h1.75C20.04 14.17 22 12.34 22 10c0-4.42-4.48-8-10-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                  </svg>
                  <input
                    type="color"
                    value={newColor ?? "#008c9e"}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isCreating || !newName.trim()}
                  className="flex-1 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--color-accent-primary)",
                    color: "#ffffff",
                    boxShadow: "var(--shadow-neo-raised-sm)",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={handleCancelCreate}
                  className="px-3 py-2 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    color: "var(--color-text-muted)",
                    boxShadow: "var(--shadow-neo-raised-sm)",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {!isOpen && (
        <div
          className="relative flex flex-col items-center mt-2"
          onMouseEnter={() => setShowCascade(true)}
          onMouseLeave={() => setShowCascade(false)}
        >
          <button
            type="button"
            onClick={() => setShowCascade((show) => !show)}
            title={activeName}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer shrink-0"
            style={{
              backgroundColor: activeColor,
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 600,
              boxShadow: "var(--shadow-neo-raised-sm)",
            }}
          >
            {activeName.charAt(0).toUpperCase()}
          </button>

          {showCascade && (
            <div
              className="absolute left-full top-0 ml-3 w-44 rounded-xl p-2 flex flex-col gap-1 z-50"
              style={{
                backgroundColor: "var(--color-bg-surface)",
                boxShadow: "var(--shadow-neo-raised)",
              }}
            >
              {cascadeOptions.map((option) => {
                const isCurrent = option.id === selectedId;
                return (
                  <button
                    key={option.id ?? "all"}
                    onClick={() => handleSelect(option.id)}
                    className="w-full px-3 py-2 rounded-lg text-left truncate cursor-pointer transition-colors duration-150"
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      backgroundColor: isCurrent
                        ? option.color || "var(--color-accent-primary)"
                        : "transparent",
                      color: isCurrent
                        ? "#ffffff"
                        : "var(--color-text-muted)",
                    }}
                  >
                    {option.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
