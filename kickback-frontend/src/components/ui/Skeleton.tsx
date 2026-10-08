// src/components/ui/Skeleton.tsx
import type { ReactNode } from "react";

/**
 * One placeholder block. Purely decorative (aria-hidden) — always wrap a
 * group of them in <LoadingRegion> so assistive tech gets a single
 * "Loading ..." announcement instead of a pile of empty divs.
 *
 * The pulse is motion-safe only: people with "reduce motion" turned on get
 * a still placeholder instead of an animation.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-bg-raised rounded-md motion-safe:animate-pulse ${className}`}
    />
  );
}

interface LoadingRegionProps {
  /** What is loading, e.g. "Loading cafés" — announced once by screen readers. */
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps a skeleton layout. role="status" is a polite live region, so the
 * label is announced when it appears; aria-busy marks the content as not
 * final yet.
 */
export function LoadingRegion({ label, children, className = "" }: LoadingRegionProps) {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}