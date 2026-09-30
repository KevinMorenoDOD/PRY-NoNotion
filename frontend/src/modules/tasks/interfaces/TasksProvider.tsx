import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Task } from "../domain/Task";
import type { TaskList } from "../domain/TaskList";
import { TaskStatus } from "../domain/TaskStatus";
import type { EditTaskRequest } from "../infrastructure/tasksApi";
import type { CreateTaskRequest } from "../infrastructure/tasksApi";
import { useTaskLists } from "../application/useTaskLists";
import { useTasks } from "../application/useTasks";
import { useCreateTask } from "../application/useCreateTask";

export type TaskFilter = "all" | "today" | "upcoming" | "done";

interface TasksContextValue {
  taskLists: TaskList[];
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  selectedListId: number | null;
  setSelectedListId: (id: number | null) => void;
  selectedTaskId: number | null;
  setSelectedTaskId: (id: number | null) => void;
  selectedTask: Task | null;
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  newListToken: number;
  requestNewList: () => void;
  createTask: (data: CreateTaskRequest) => Promise<void>;
  createList: (name: string, color?: string) => Promise<void>;
  deleteList: (id: number) => Promise<void>;
  editTask: (id: number, data: EditTaskRequest) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  moveTask: (taskId: number, listId: number) => Promise<void>;
}

const TasksContext = createContext<TasksContextValue | null>(null);

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function TasksProvider({ children }: { children: ReactNode }) {
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
  const { execute: createTaskRequest, isLoading: creatingTask } = useCreateTask();

  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [newListToken, setNewListToken] = useState(0);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (selectedListId !== null) {
      result = result.filter((t) => t.taskListId === selectedListId);
    }
    const now = new Date();
    if (filter === "today") {
      result = result.filter(
        (t) =>
          t.dueDate &&
          isSameDay(new Date(t.dueDate), now) &&
          t.status !== TaskStatus.DONE
      );
    } else if (filter === "upcoming") {
      result = result.filter(
        (t) => t.dueDate && new Date(t.dueDate) > now && t.status !== TaskStatus.DONE
      );
    } else if (filter === "done") {
      result = result.filter((t) => t.status === TaskStatus.DONE);
    }
    return result;
  }, [tasks, selectedListId, filter]);

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  const createTask = useCallback(
    async (data: CreateTaskRequest) => {
      const created = await createTaskRequest(data);
      if (created) await refetchTasks();
    },
    [createTaskRequest, refetchTasks]
  );

  const createList = useCallback(
    async (name: string, color?: string) => {
      await createTaskList({ name, color });
    },
    [createTaskList]
  );

  const deleteList = useCallback(
    async (id: number) => {
      await deleteTaskList(id);
      setSelectedListId((current) => (current === id ? null : current));
    },
    [deleteTaskList]
  );

  const editTaskAndSync = useCallback(
    async (id: number, data: EditTaskRequest) => {
      await editTask(id, data);
    },
    [editTask]
  );

  const deleteTaskAndSync = useCallback(
    async (id: number) => {
      await deleteTask(id);
      setSelectedTaskId((current) => (current === id ? null : current));
    },
    [deleteTask]
  );

  const moveTask = useCallback(
    async (taskId: number, listId: number) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task || task.taskListId === listId) return;
      await editTask(taskId, { listId });
    },
    [tasks, editTask]
  );

  const value: TasksContextValue = {
    taskLists,
    tasks,
    filteredTasks,
    isLoading: listsLoading || tasksLoading || creatingTask,
    selectedListId,
    setSelectedListId,
    selectedTaskId,
    setSelectedTaskId,
    selectedTask,
    filter,
    setFilter,
    newListToken,
    requestNewList: () => setNewListToken((t) => t + 1),
    createTask,
    createList,
    deleteList,
    editTask: editTaskAndSync,
    deleteTask: deleteTaskAndSync,
    moveTask,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasksContext() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasksContext must be used within a TasksProvider");
  }
  return context;
}
