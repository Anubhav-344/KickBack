// src/features/auth/components/DevLoginPanel.tsx
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

// Shaped to exactly match useAuthStore's User interface — userId (number)
// and role are both required there, so mock users must include them too
// or login() won't type-check.
const MOCK_USERS = {
  newUser: {
    userId: 101,
    firstName: "Alex",
    lastName: "New",
    email: "alex.new@test.com",
    role: "USER" as const,
  },
  regularUser: {
    userId: 102,
    firstName: "Sam",
    lastName: "Regular",
    email: "sam.reg@test.com",
    role: "USER" as const,
  },
  powerUser: {
    userId: 103,
    firstName: "Jordan",
    lastName: "Power",
    email: "jordan.power@test.com",
    role: "USER" as const,
  },
};

export default function DevLoginPanel({ redirectTo }: { redirectTo?: string }) {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const loginAs = (key: keyof typeof MOCK_USERS) => {
    login(MOCK_USERS[key], "dev-mock-token");
    navigate(redirectTo || "/");
  };

  return (
    <div className="mt-6 border-t border-dashed border-border-subtle pt-4">
      <p className="text-[10px] uppercase tracking-wide text-text-secondary mb-2">
        Dev Only &mdash; Quick Login
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => loginAs("newUser")}
          className="text-xs px-3 py-1.5 rounded-md border border-border-subtle text-text-secondary hover:text-text-primary transition-colors"
        >
          New User
        </button>
        <button
          type="button"
          onClick={() => loginAs("regularUser")}
          className="text-xs px-3 py-1.5 rounded-md border border-border-subtle text-text-secondary hover:text-text-primary transition-colors"
        >
          Regular User
        </button>
        <button
          type="button"
          onClick={() => loginAs("powerUser")}
          className="text-xs px-3 py-1.5 rounded-md border border-border-subtle text-text-secondary hover:text-text-primary transition-colors"
        >
          Power User
        </button>
      </div>
    </div>
  );
}
