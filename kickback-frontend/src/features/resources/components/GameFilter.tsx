// src/features/resources/components/GameFilter.tsx
import * as Dialog from "@radix-ui/react-dialog";
import BottomSheet from "@/components/ui/BottomSheet";

interface GameFilterProps {
  games: string[];
  selectedGame: string | null;
  onSelect: (game: string | null) => void;
}

export default function GameFilter({ games, selectedGame, onSelect }: GameFilterProps) {
  // Filter only applies when the resource type supports games AND has more
  // than one distinct game across its units — a single-game type has nothing
  // to filter, and non-game resource types (pool, snooker) never render this.
  if (games.length <= 1) return null;

  return (
    <BottomSheet
      title="Filter by game"
      trigger={
        <button className="flex items-center gap-2 text-[13px] font-medium text-text-primary border border-border-subtle bg-bg-surface px-3.5 py-2 rounded-pill">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          {selectedGame ?? "All games"}
        </button>
      }
    >
      <div className="flex flex-col gap-2">
        <Dialog.Close asChild>
          <button
            onClick={() => onSelect(null)}
            className={`text-left px-3.5 py-2.5 rounded-card border transition-colors ${
              selectedGame === null
                ? "border-accent bg-accent/10 text-text-primary"
                : "border-border-subtle bg-bg-raised text-text-secondary"
            }`}
          >
            All games
          </button>
        </Dialog.Close>
        {games.map((game) => (
          <Dialog.Close asChild key={game}>
            <button
              onClick={() => onSelect(game)}
              className={`text-left px-3.5 py-2.5 rounded-card border transition-colors ${
                selectedGame === game
                  ? "border-accent bg-accent/10 text-text-primary"
                  : "border-border-subtle bg-bg-raised text-text-secondary"
              }`}
            >
              {game}
            </button>
          </Dialog.Close>
        ))}
      </div>
    </BottomSheet>
  );
}
