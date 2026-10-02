// src/components/ui/Card.tsx
import type { HTMLAttributes } from "react";

type CardPadding = "none" | "sm" | "md";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  raised?: boolean; // bg-bg-raised instead of bg-bg-surface — for nested cards
}

const PADDING_CLASSES: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-3.5",
};

// Consolidates the "bg-bg-surface border border-border-subtle rounded-card"
// wrapper duplicated across BookingSummaryCard, PriceBreakdownCard, offer
// cards, resource cards, etc.
export default function Card({
  padding = "md",
  raised = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`${raised ? "bg-bg-raised" : "bg-bg-surface"} border border-border-subtle rounded-card ${PADDING_CLASSES[padding]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
}
