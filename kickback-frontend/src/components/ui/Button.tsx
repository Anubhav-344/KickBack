// src/components/ui/Button.tsx
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

// Consolidates the primary/secondary/ghost button styling that was
// duplicated across 9+ files (LoginPage, SignupPage, ProfilePage,
// BookingPreviewPage, BookFloatingButton, etc.) into one source of truth.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent hover:bg-accent-hover text-on-accent shadow-accent-glow",
  secondary: "bg-bg-surface hover:bg-bg-raised border border-border-subtle text-text-primary",
  ghost: "bg-transparent hover:underline text-accent-text",
  destructive: "bg-state-error hover:opacity-90 text-on-error",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      fullWidth = true,
      isLoading = false,
      loadingText,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isGhost = variant === "ghost";
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={`font-semibold text-base transition-opacity disabled:opacity-50 ${
          isGhost ? "text-xs font-medium py-1" : "py-4 rounded-card"
        } ${fullWidth && !isGhost ? "w-full" : ""} ${VARIANT_CLASSES[variant]} ${className ?? ""}`}
        {...props}
      >
        {isLoading ? loadingText ?? "Loading..." : children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
