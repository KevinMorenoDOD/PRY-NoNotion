import { NavLink } from "react-router-dom";
import { useLogout } from "@auth/application/useLogout";

const navItems = [{ to: "/dashboard", label: "Dashboard" }];

export function Sidebar() {
  const { execute: logout, isLoading: loggingOut } = useLogout();

  return (
    <aside
      className="w-56 h-screen flex flex-col p-4 shrink-0 relative z-20"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        boxShadow: "8px 0 20px rgba(45, 52, 54, 0.18)",
      }}
    >
      <div className="mb-8 px-2 py-1">
        <h1
          className="text-xl font-semibold"
          style={{ color: "var(--color-heading)" }}
        >
          NoNotion
        </h1>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="px-4 py-3 rounded-xl transition-all duration-200"
            style={({ isActive }) => ({
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              ...(isActive
                ? {
                    backgroundColor: "var(--color-accent-primary)",
                    color: "#ffffff",
                    boxShadow: "var(--shadow-neo-elevated)",
                  }
                : {
                    color: "var(--color-text-muted)",
                    boxShadow: "var(--shadow-neo-raised-sm)",
                  }),
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        disabled={loggingOut}
        className="mt-auto px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50"
        style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--color-danger)",
          boxShadow: "var(--shadow-neo-raised-sm)",
          backgroundColor: "var(--color-bg-surface)",
        }}
      >
        {loggingOut ? "Signing out..." : "Sign out"}
      </button>
    </aside>
  );
}
