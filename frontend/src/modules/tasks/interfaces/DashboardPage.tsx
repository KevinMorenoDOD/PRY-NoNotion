import { useState } from "react";
import { useTaskLists } from "@tasks/application/useTaskLists";
import { useTasks } from "@tasks/application/useTasks";
import { useCreateTask } from "@tasks/application/useCreateTask";
import { TaskListsSidebar } from "./components/TaskListsSidebar";
import { TaskCard } from "./components/TaskCard";
import { TaskForm } from "./components/TaskForm";
import { TaskDetailModal } from "./components/TaskDetailModal";
import { TaskStatus } from "@tasks/domain/TaskStatus";

export function DashboardPage() {
  const {
    taskLists,
    isLoading: listsLoading,
    createTaskList,
    deleteTaskList,
  } = useTaskLists();
  const {
    tasks,
    isLoading: tasksLoading,
    editTask,
    deleteTask,
    refetch: refetchTasks,
  } = useTasks();
  const { execute: createTask, isLoading: creating } = useCreateTask();
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

  const filteredTasks =
    selectedListId === null
      ? tasks
      : tasks.filter((t) => t.taskListId === selectedListId);

  const handleCreateTask: React.ComponentProps<typeof TaskForm>["onSubmit"] = async (data) => {
    const created = await createTask(data);
    if (created) {
      await refetchTasks();
    }
  };

  const handleStatusChange = async (id: number, status: TaskStatus) => {
    await editTask(id, { taskStatus: status });
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
  };

  const handleDropTask = async (taskId: number, listId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.taskListId === listId) return;
    await editTask(taskId, { listId });
  };

  if (listsLoading || tasksLoading) {
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
      <TaskListsSidebar
        taskLists={taskLists}
        selectedId={selectedListId}
        onSelect={setSelectedListId}
        onCreate={(name, color) => createTaskList({ name, color })}
        onDelete={deleteTaskList}
        onDropTask={handleDropTask}
      />

      <div className="flex-1 min-w-0 h-full overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <TaskForm
              taskListId={selectedListId}
              onSubmit={handleCreateTask}
              isLoading={creating}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                taskLists={taskLists}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
                onOpen={(t) => setSelectedTaskId(t.id)}
              />
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div
              className="text-center py-12"
              style={{ color: "var(--color-text-muted)" }}
            >
              No tasks yet. Create one above.
            </div>
          )}
        </div>
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          taskLists={taskLists}
          onClose={() => setSelectedTaskId(null)}
          onStatusChange={handleStatusChange}
          onDelete={async (id) => {
            await handleDeleteTask(id);
            setSelectedTaskId(null);
          }}
        />
      )}
    </div>
  );
}
