import { useEffect, useState, type FormEvent } from "react";
import { useTasksContext } from "../TasksProvider";

export function TasksPanel() {
  const {
    taskLists,
    selectedListId,
    setSelectedListId,
    createList,
    deleteList,
    newListToken,
  } = useTasksContext();

  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (newListToken > 0) setFormOpen(true);
  }, [newListToken]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createList(name.trim());
    setName("");
    setFormOpen(false);
  };

  return (
    <div className="h-full overflow-y-auto px-2 pb-4 flex flex-col gap-3">
      <div>
        <div className="flex items-center justify-between px-1 py-1">
          <h3
            className="text-xs uppercase tracking-wide"
            style={{ color: "var(--color-text-muted)" }}
          >
            Lists
          </h3>
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            title="New list"
            className="w-5 h-5 flex items-center justify-center rounded-md text-xs cursor-pointer"
            style={{ boxShadow: "var(--shadow-neo-raised-sm)", color: "var(--color-text-primary)" }}
          >
            ＋
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setSelectedListId(null)}
            className="w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer"
            style={{
              backgroundColor: selectedListId === null ? "var(--color-surface-soft)" : "transparent",
              color: "var(--color-text-primary)",
            }}
          >
            📋 All tasks
          </button>

          {taskLists.map((list) => {
            const active = selectedListId === list.id;
            return (
              <div
                key={list.id}
                className="group flex items-center rounded-lg"
                style={{
                  backgroundColor: active ? "var(--color-surface-soft)" : "transparent",
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedListId(list.id)}
                  className="flex-1 min-w-0 flex items-center gap-2 px-3 py-2 text-left text-sm cursor-pointer"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: list.color || "var(--color-accent-light)" }}
                  />
                  <span className="truncate">{list.name}</span>
                </button>
                <button
                  type="button"
                  title="Delete list"
                  onClick={() => deleteList(list.id)}
                  className="opacity-0 group-hover:opacity-100 px-2 cursor-pointer"
                  style={{ color: "var(--color-danger)", fontSize: "11px" }}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {formOpen && (
          <form onSubmit={handleSubmit} className="mt-2 flex gap-1">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New list"
              className="flex-1 min-w-0 px-2 py-1 rounded-lg border-none outline-none text-sm"
              style={{
                backgroundColor: "var(--color-bg-surface)",
                color: "var(--color-text-primary)",
                boxShadow: "var(--shadow-neo-pressed-sm)",
              }}
            />
            <button
              type="submit"
              className="px-2 py-1 rounded-lg text-xs cursor-pointer"
              style={{ backgroundColor: "var(--color-accent-primary)", color: "#fff" }}
            >
              OK
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
