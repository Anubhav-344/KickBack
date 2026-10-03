// src/features/booking/components/GameSelectPopover.tsx
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { GameOption } from "@/features/resources/types";

interface GameSelectPopoverProps {
  games: GameOption[];
  selectedGameId: number | null;
  onSelect: (game: GameOption) => void;
  trigger: ReactNode;
}

// Desktop-only anchored popover counterpart to GameSelectField's mobile
// bottom sheet — same pattern as the other three pickers (resource-type
// switcher, game filter, offer selector).
export default function GameSelectPopover({
  games,
  selectedGameId,
  onSelect,
  trigger,
}: GameSelectPopoverProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSelect = (game: GameOption) => {
    setOpen(false);
    onSelect(game);
  };

  return (
    <div ref={containerRef} className="relative">
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-full bg-bg-raised border border-border-subtle rounded-card p-1.5 shadow-lg z-20">
          {games.map((g) => (
            <button
              key={g.gameId}
              onClick={() => handleSelect(g)}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-colors ${
                selectedGameId === g.gameId
                  ? "bg-accent/10 text-text-primary"
                  : "text-text-secondary hover:bg-bg-surface"
              }`}
            >
              {g.gameName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
