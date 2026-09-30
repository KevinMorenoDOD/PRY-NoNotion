import type { ReactNode } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "@shared/interfaces/hooks/useAuth";
import { Layout } from "@shared/interfaces/components/Layout";
import { ProtectedRoute } from "@shared/interfaces/components/ProtectedRoute";
import { SidebarProvider } from "@shared/interfaces/sidebar/SidebarProvider";
import type { ModuleDefinition } from "@shared/interfaces/sidebar/types";
import { LoginPage } from "@auth/interfaces/LoginPage";
import { RegisterPage } from "@auth/interfaces/RegisterPage";
import { DashboardPage } from "@tasks/interfaces/DashboardPage";
import { TasksProvider } from "@tasks/interfaces/TasksProvider";
import { TasksPanel } from "@tasks/interfaces/components/TasksPanel";
import { TasksActions } from "@tasks/interfaces/components/TasksActions";
import { NotesPage } from "@notes/interfaces/NotesPage";
import { NotesProvider } from "@notes/interfaces/NotesProvider";
import { NotesPanel } from "@notes/interfaces/components/NotesPanel";
import { NotesActions } from "@notes/interfaces/components/NotesActions";
import { NotesFooter } from "@notes/interfaces/components/NotesFooter";

const modules: ModuleDefinition[] = [
  {
    id: "notes",
    name: "Notes",
    icon: "🗒",
    path: "/notes",
    order: 1,
    Panel: NotesPanel,
    Actions: NotesActions,
    Footer: NotesFooter,
  },
  {
    id: "tasks",
    name: "Tasks",
    icon: "✓",
    path: "/dashboard",
    order: 2,
    Panel: TasksPanel,
    Actions: TasksActions,
  },
];

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NotesProvider>
      <TasksProvider>{children}</TasksProvider>
    </NotesProvider>
  );
}

function AuthenticatedLayout() {
  return (
    <ProtectedRoute>
      <AppProviders>
        <Layout>
          <Outlet />
        </Layout>
      </AppProviders>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <SidebarProvider modules={modules}>
        <Routes>
          <Route path="/" element={<Navigate to="/notes" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<AuthenticatedLayout />}>
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/notes" replace />} />
        </Routes>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
