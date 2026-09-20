import { useState, type FormEvent } from "react";
import type { ApiError } from "@shared/domain/ApiError";

interface AuthFormProps {
  title: string;
  submitLabel: string;
  onSubmit: (data: { email: string; password: string; displayName?: string }) => void;
  isLoading: boolean;
  error: ApiError | null;
  showDisplayName?: boolean;
}

export function AuthForm({
  title,
  submitLabel,
  onSubmit,
  isLoading,
  error,
  showDisplayName = false,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, displayName });
  };

  return (
    <div className="w-full max-w-md">
      <div
        className="rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--color-bg-surface)",
          boxShadow: "var(--shadow-neo-raised)",
        }}
      >
          <h1
            className="text-2xl font-semibold text-center mb-8"
            style={{ color: "var(--color-heading)", fontWeight: 500 }}
          >
            {title}
          </h1>

          {error && (
            <div
              className="mb-6 p-4 rounded-xl"
              style={{
                backgroundColor: "rgba(243, 139, 168, 0.1)",
                border: "1px solid rgba(243, 139, 168, 0.25)",
              }}
            >
              <p className="text-sm" style={{ color: "var(--color-danger)" }}>
                {error.message}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {showDisplayName && (
              <div>
                <label
                  htmlFor="displayName"
                  className="block mb-2"
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--color-text-muted)",
                  }}
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-none outline-none transition-shadow"
                  style={{
                    backgroundColor: "var(--color-bg-surface)",
                    color: "var(--color-text-primary)",
                    boxShadow: "var(--shadow-neo-pressed)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow =
                      "var(--shadow-neo-pressed), 0 0 0 2px var(--color-accent-primary)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-neo-pressed)";
                  }}
                  placeholder="Your name"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block mb-2"
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-muted)",
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-none outline-none transition-shadow"
                style={{
                  backgroundColor: "var(--color-bg-surface)",
                  color: "var(--color-text-primary)",
                  boxShadow: "var(--shadow-neo-pressed)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow =
                    "var(--shadow-neo-pressed), 0 0 0 2px var(--color-accent-primary)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-neo-pressed)";
                }}
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2"
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-muted)",
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl border-none outline-none transition-shadow"
                style={{
                  backgroundColor: "var(--color-bg-surface)",
                  color: "var(--color-text-primary)",
                  boxShadow: "var(--shadow-neo-pressed)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow =
                    "var(--shadow-neo-pressed), 0 0 0 2px var(--color-accent-primary)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-neo-pressed)";
                }}
                placeholder="At least 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 px-6 py-3 rounded-xl font-medium cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-accent-primary)",
                color: "#ffffff",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                boxShadow: "var(--shadow-neo-raised-sm)",
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-neo-pressed-sm)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-neo-raised-sm)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-neo-raised-sm)";
              }}
            >
              {isLoading ? "Loading..." : submitLabel}
            </button>
          </form>
        </div>
      </div>
  );
}
