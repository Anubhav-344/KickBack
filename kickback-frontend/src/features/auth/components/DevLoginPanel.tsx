// src/features/auth/components/DevLoginPanel.tsx
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const MOCK_USERS = {
  newUser: {
    id: "u_new",
    firstName: "Alex",
    lastName: "New",
    email: "alex.new@test.com",
  },
  regularUser: {
    id: "u_reg",
    firstName: "Sam",
    lastName: "Regular",
    email: "sam.reg@test.com",
  },
  powerUser: {
    id: "u_power",
    firstName: "Jordan",
    lastName: "Power",
    email: "jordan.power@test.com",
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
    <div className="mt-6 border-t border-dashed border-border pt-4">
      <p className="text-[10px] uppercase tracking-wide text-text-secondary mb-2">
        Dev Only — Quick Login
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => loginAs("newUser")}
          className="text-xs px-3 py-1.5 rounded-md border border-border text-text-secondary hover:text-text-primary"
        >
          New User
        </button>
        <button
          type="button"
          onClick={() => loginAs("regularUser")}
          className="text-xs px-3 py-1.5 rounded-md border border-border text-text-secondary hover:text-text-primary"
        >
          Regular User
        </button>
        <button
          type="button"
          onClick={() => loginAs("powerUser")}
          className="text-xs px-3 py-1.5 rounded-md border border-border text-text-secondary hover:text-text-primary"
        >
          Power User
        </button>
      </div>
    </div>
  );
}