// src/features/resources/components/GameFilter.tsx
import * as Dialog from "@radix-ui/react-dialog";
import BottomSheet from "@/components/ui/BottomSheet";
import GameFilterPopover from "./GameFilterPopover";
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

  const triggerButton = (
    <button className="flex items-center gap-2 text-[13px] lg:text-sm font-medium text-text-primary border border-border-subtle bg-bg-surface px-3.5 lg:px-4 py-2 lg:py-2.5 rounded-pill">
      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
      {selectedName ?? "All games"}
    </button>
  );

  return (
    <>
      {/* Mobile/tablet: bottom sheet, unchanged */}
      <div className="lg:hidden">
        <BottomSheet title="Filter by game" trigger={triggerButton}>
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
      </div>

      {/* Desktop: anchored popover */}
      <div className="hidden lg:block">
        <GameFilterPopover
          games={games}
          selectedGameId={selectedGameId}
          onSelect={onSelect}
          trigger={triggerButton}
        />
      </div>
    </>
  );
}