import { Link } from "react-router-dom";
import { useLogin } from "@auth/application/useLogin";
import { AuthForm } from "./components/AuthForm";

export function LoginPage() {
  const { execute, error, isLoading } = useLogin();

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center gap-4 p-4 overflow-y-auto"
      style={{ backgroundColor: "var(--color-bg-surface)" }}
    >
      <AuthForm
        title="Sign In"
        submitLabel="Sign In"
        onSubmit={(data) => execute(data.email, data.password)}
        isLoading={isLoading}
        error={error}
      />
      <Link
        to="/register"
        className="transition-colors"
        style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--color-text-muted)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--color-heading)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--color-text-muted)";
        }}
      >
        Don&apos;t have an account? Sign up
      </Link>
    </div>
  );
}
