// src/features/booking/components/GameSelectPopover.tsx
import type { ReactNode } from "react";
import Popover from "@/components/ui/Popover";
import type { GameOption } from "@/features/resources/types";

interface GameSelectPopoverProps {
  games: GameOption[];
  selectedGameId: number | null;
  onSelect: (game: GameOption) => void;
  trigger: ReactNode;
}

// Desktop-only anchored popover counterpart to GameSelectField's mobile bottom sheet.
export default function GameSelectPopover({
  games,
  selectedGameId,
  onSelect,
  trigger,
}: GameSelectPopoverProps) {
  return (
    <Popover trigger={trigger} label="Choose a game" panelClassName="w-full p-1.5">
      {(close) =>
        games.map((g) => (
          <button
            key={g.gameId}
            type="button"
            aria-current={selectedGameId === g.gameId ? "true" : undefined}
            onClick={() => {
              close();
              onSelect(g);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-colors ${
              selectedGameId === g.gameId
                ? "bg-accent/10 text-text-primary"
                : "text-text-secondary hover:bg-bg-surface"
            }`}
          >
            {g.gameName}
          </button>
        ))
      }
    </Popover>
  );
}