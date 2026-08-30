// src/components/ui/Input.tsx
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="mb-4">
        <label className="block text-xs text-text-secondary mb-1.5">{label}</label>
        <input
          ref={ref}
          className={`w-full bg-bg-surface border rounded-card px-3.5 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors ${
            error ? "border-state-error" : "border-border-subtle"
          } ${className ?? ""}`}
          {...props}
        />
        {error && <p className="text-[11px] text-state-error mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
