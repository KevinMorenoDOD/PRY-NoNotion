import { useTasksContext, type TaskFilter } from "../TasksProvider";

export function TasksActions() {
  const { requestNewList, filter, setFilter, selectedListId, setSelectedListId } =
    useTasksContext();

  return (
    <>
      <button
        type="button"
        onClick={requestNewList}
        title="New list"
        aria-label="New list"
        className="w-6 h-6 flex items-center justify-center rounded-lg cursor-pointer text-sm"
        style={{ boxShadow: "var(--shadow-neo-raised-sm)", color: "var(--color-text-primary)" }}
      >
        ＋
      </button>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value as TaskFilter)}
        title="Filter"
        className="h-6 px-1 rounded-lg border-none outline-none cursor-pointer text-xs"
        style={{ backgroundColor: "var(--color-surface-soft)", color: "var(--color-text-muted)" }}
      >
        <option value="all">All</option>
        <option value="today">Today</option>
        <option value="upcoming">Upcoming</option>
        <option value="done">Completed</option>
      </select>

      {selectedListId !== null && (
        <button
          type="button"
          onClick={() => setSelectedListId(null)}
          title="Remove list filter"
          className="w-6 h-6 flex items-center justify-center rounded-lg cursor-pointer text-xs"
          style={{ boxShadow: "var(--shadow-neo-raised-sm)", color: "var(--color-text-muted)" }}
        >
          ✕
        </button>
      )}
    </>
  );
}
