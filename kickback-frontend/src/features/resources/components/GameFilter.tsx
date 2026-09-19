// src/features/resources/components/GameFilter.tsx
import * as Dialog from "@radix-ui/react-dialog";
import BottomSheet from "@/components/ui/BottomSheet";
import type { GameOption } from "../types";

interface GameFilterProps {
  games: GameOption[];
  selectedGameId: number | null;
  onSelect: (gameId: number | null) => void;
}

export default function GameFilter({ games, selectedGameId, onSelect }: GameFilterProps) {
  // Filter only applies when the resource type has more than one distinct
  // game across its units — a single-game type has nothing to filter, and
  // non-game types (pool, snooker) never render this at all.
  if (games.length <= 1) return null;

  const selectedName = games.find((g) => g.gameId === selectedGameId)?.gameName;

  return (
    <BottomSheet
      title="Filter by game"
      trigger={
        <button className="flex items-center gap-2 text-[13px] font-medium text-text-primary border border-border-subtle bg-bg-surface px-3.5 py-2 rounded-pill">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          {selectedName ?? "All games"}
        </button>
      }
    >
      <div className="flex flex-col gap-2">
        <Dialog.Close asChild>
          <button
            onClick={() => onSelect(null)}
            className={`text-left px-3.5 py-2.5 rounded-card border transition-colors ${
              selectedGameId === null
                ? "border-accent bg-accent/10 text-text-primary"
                : "border-border-subtle bg-bg-raised text-text-secondary"
            }`}
          >
            All games
          </button>
        </Dialog.Close>
        {games.map((game) => (
          <Dialog.Close asChild key={game.gameId}>
            <button
              onClick={() => onSelect(game.gameId)}
              className={`text-left px-3.5 py-2.5 rounded-card border transition-colors ${
                selectedGameId === game.gameId
                  ? "border-accent bg-accent/10 text-text-primary"
                  : "border-border-subtle bg-bg-raised text-text-secondary"
              }`}
            >
              {game.gameName}
            </button>
          </Dialog.Close>
        ))}
      </div>
    </BottomSheet>
  );
}
