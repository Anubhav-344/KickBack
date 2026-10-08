// src/features/resources/components/GameFilterPopover.tsx
import type { ReactNode } from "react";
import Popover from "@/components/ui/Popover";
import type { GameOption } from "../types";

interface GameFilterPopoverProps {
  games: GameOption[];
  selectedGameId: number | null;
  onSelect: (gameId: number | null) => void;
  trigger: ReactNode;
}

// Desktop-only anchored popover counterpart to GameFilter's mobile bottom
// sheet. Right-aligned, since this trigger sits on the right of the Filters row.
export default function GameFilterPopover({
  games,
  selectedGameId,
  onSelect,
  trigger,
}: GameFilterPopoverProps) {
  return (
    <Popover
      trigger={trigger}
      label="Filter by game"
      align="right"
      className="inline-block"
      panelClassName="w-56 p-1.5"
    >
      {(close) => (
        <>
          <button
            type="button"
            aria-current={selectedGameId === null ? "true" : undefined}
            onClick={() => {
              close();
              onSelect(null);
            }}
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
              type="button"
              aria-current={selectedGameId === game.gameId ? "true" : undefined}
              onClick={() => {
                close();
                onSelect(game.gameId);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                selectedGameId === game.gameId
                  ? "bg-accent/10 text-text-primary"
                  : "text-text-secondary hover:bg-bg-surface"
              }`}
            >
              {game.gameName}
            </button>
          ))}
        </>
      )}
    </Popover>
  );
}