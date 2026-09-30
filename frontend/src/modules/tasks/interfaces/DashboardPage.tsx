import { TaskCard } from "./components/TaskCard";
import { TaskForm } from "./components/TaskForm";
import { TaskDetailModal } from "./components/TaskDetailModal";
import { useTasksContext } from "./TasksProvider";

export function DashboardPage() {
  const {
    taskLists,
    filteredTasks,
    isLoading,
    selectedListId,
    selectedTask,
    setSelectedTaskId,
    createTask,
    editTask,
    deleteTask,
  } = useTasksContext();

  if (isLoading && filteredTasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div
          className="animate-pulse text-lg"
          style={{ color: "var(--color-heading)" }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full">
      <div className="flex-1 min-w-0 h-full overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <TaskForm
              taskListId={selectedListId}
              onSubmit={createTask}
              isLoading={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                taskLists={taskLists}
                onStatusChange={(id, status) => editTask(id, { taskStatus: status })}
                onDelete={(id) => deleteTask(id)}
                onOpen={(t) => setSelectedTaskId(t.id)}
              />
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div
              className="text-center py-12"
              style={{ color: "var(--color-text-muted)" }}
            >
              No tasks. Create one above or change the filter.
            </div>
          )}
        </div>
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          taskLists={taskLists}
          onClose={() => setSelectedTaskId(null)}
          onStatusChange={(id, status) => editTask(id, { taskStatus: status })}
          onDelete={async (id) => {
            await deleteTask(id);
          }}
        />
      )}
    </div>
  );
}
