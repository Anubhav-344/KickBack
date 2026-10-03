// src/components/ui/Input.tsx
import { forwardRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  // Tighter padding/margins for pages with many fields that need to fit
  // without scrolling (Profile) — default (false) is unchanged from what
  // Login/Signup already use, so this never affects those pages.
  compact?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type, compact = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={compact ? "mb-3" : "mb-5"}>
        <label
          className={`block text-text-secondary ${compact ? "text-xs mb-1" : "text-sm mb-2"}`}
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={resolvedType}
            className={`w-full bg-bg-surface border rounded-card text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors ${
              compact ? "px-3.5 py-2.5 text-sm" : "px-4 py-3.5 text-base"
            } ${isPassword ? (compact ? "pr-10" : "pr-12") : ""} ${
              error ? "border-state-error" : "border-border-subtle"
            } ${className ?? ""}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
            >
              {showPassword ? (
                <EyeOff size={compact ? 15 : 18} />
              ) : (
                <Eye size={compact ? 15 : 18} />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className={`text-state-error ${compact ? "text-[10px] mt-1" : "text-xs mt-1.5"}`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
