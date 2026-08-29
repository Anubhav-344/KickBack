// src/features/booking/components/HoldCountdown.tsx
import { useEffect, useState } from "react";

interface HoldCountdownProps {
  expiresAt: number; // epoch ms
  onExpire?: () => void;
}

export default function HoldCountdown({ expiresAt, onExpire }: HoldCountdownProps) {
  const [remainingMs, setRemainingMs] = useState(() => expiresAt - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const next = expiresAt - Date.now();
      setRemainingMs(next);
      if (next <= 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  const isExpired = remainingMs <= 0;

  return (
    <div
      className={`mx-4 mt-3.5 flex items-center justify-between rounded-card px-3.5 py-2.5 border ${
        isExpired
          ? "bg-state-error/10 border-state-error/35"
          : "bg-state-pending/10 border-state-pending/35"
      }`}
    >
      <span className={`text-xs font-medium ${isExpired ? "text-state-error" : "text-state-pending"}`}>
        {isExpired ? "Hold expired — slot released" : "Complete payment to confirm your slot"}
      </span>
      <span className={`font-semibold text-sm tabular-nums ${isExpired ? "text-state-error" : "text-state-pending"}`}>
        {mm}:{ss}
      </span>
    </div>
  );
}
