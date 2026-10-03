// src/features/resources/components/GameFilterPopover.tsx
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { GameOption } from "../types";

interface GameFilterPopoverProps {
  games: GameOption[];
  selectedGameId: number | null;
  onSelect: (gameId: number | null) => void;
  trigger: ReactNode;
}

// Desktop-only anchored popover counterpart to GameFilter's mobile bottom
// sheet — same pattern as ResourceTypePopover. Positioned right-aligned
// (right-0, not left-0) since this trigger typically sits on the right
// side of the Filters row.
export default function GameFilterPopover({
  games,
  selectedGameId,
  onSelect,
  trigger,
}: GameFilterPopoverProps) {
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

  const handleSelect = (gameId: number | null) => {
    setOpen(false);
    onSelect(gameId);
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-bg-raised border border-border-subtle rounded-card p-1.5 shadow-lg z-20">
          <button
            onClick={() => handleSelect(null)}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
              selectedGameId === null
                ? "bg-accent/10 text-text-primary"
                : "text-text-secondary hover:bg-bg-surface"
            }`}
          >
            All games
          </button>
          {games.map((game) => (
            <button
              key={game.gameId}
              onClick={() => handleSelect(game.gameId)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                selectedGameId === game.gameId
                  ? "bg-accent/10 text-text-primary"
                  : "text-text-secondary hover:bg-bg-surface"
              }`}
            >
              {game.gameName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}