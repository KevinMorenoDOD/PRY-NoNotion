import { Link } from "react-router-dom";
import { useRegister } from "@auth/application/useRegister";
import { AuthForm } from "./components/AuthForm";

export function RegisterPage() {
  const { execute, error, isLoading } = useRegister();

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center gap-4 p-4 overflow-y-auto"
      style={{ backgroundColor: "var(--color-bg-surface)" }}
    >
      <AuthForm
        title="Create Account"
        submitLabel="Sign Up"
        onSubmit={(data) => execute(data.email, data.password, data.displayName!)}
        isLoading={isLoading}
        error={error}
        showDisplayName
      />
      <Link
        to="/login"
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
        Already have an account? Sign in
      </Link>
    </div>
  );
}
