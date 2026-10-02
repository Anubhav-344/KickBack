// src/components/ui/Input.tsx
import { forwardRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

// Password visibility toggle is built in here (not per-page) — any Input
// with type="password" automatically gets the eye icon, so Login, Signup's
// Password AND Confirm Password fields all get it for free with no changes
// needed on those pages.
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="mb-4">
        <label className="block text-xs text-text-secondary mb-1.5">{label}</label>
        <div className="relative">
          <input
            ref={ref}
            type={resolvedType}
            className={`w-full bg-bg-surface border rounded-card px-3.5 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors ${
              isPassword ? "pr-11" : ""
            } ${error ? "border-state-error" : "border-border-subtle"} ${className ?? ""}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && <p className="text-[11px] text-state-error mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
