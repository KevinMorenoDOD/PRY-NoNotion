import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@shared/interfaces/hooks/useAuth";
import { Layout } from "@shared/interfaces/components/Layout";
import { ProtectedRoute } from "@shared/interfaces/components/ProtectedRoute";
import { LoginPage } from "@auth/interfaces/LoginPage";
import { RegisterPage } from "@auth/interfaces/RegisterPage";
import { DashboardPage } from "@tasks/interfaces/DashboardPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
