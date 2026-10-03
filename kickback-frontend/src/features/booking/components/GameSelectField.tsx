// src/features/booking/components/GameSelectField.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { Gamepad2, ChevronDown } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import GameSelectPopover from "./GameSelectPopover";
import { useBookingDraftStore } from "../store/useBookingDraftStore";
import type { GameOption } from "@/features/resources/types";

interface GameSelectFieldProps {
  games: GameOption[];
}

export default function GameSelectField({ games }: GameSelectFieldProps) {
  const gameId = useBookingDraftStore((s) => s.gameId);
  const gameName = useBookingDraftStore((s) => s.gameName);
  const setGame = useBookingDraftStore((s) => s.setGame);

  if (games.length === 0) return null;

  const triggerButton = (
    <button className="flex items-center justify-between w-full bg-bg-surface border border-border-subtle rounded-card px-3.5 py-3">
      <span className="flex items-center gap-2.5">
        <span className="w-[30px] h-[30px] rounded-lg bg-bg-raised flex items-center justify-center">
          <Gamepad2 size={14} className="text-text-primary" />
        </span>
        <span className="font-display font-semibold text-base text-text-primary">
          {gameName ?? "Select a game"}
        </span>
      </span>
      <ChevronDown size={16} className="text-text-secondary" />
    </button>
  );

  return (
    <div className="mb-4">
      <div className="text-xs text-text-secondary mb-1.5">Game</div>

      {/* Mobile/tablet: bottom sheet, unchanged */}
      <div className="lg:hidden">
        <BottomSheet title="Choose a game" trigger={triggerButton}>
          <div className="flex flex-col gap-2">
            {games.map((g) => (
              <Dialog.Close asChild key={g.gameId}>
                <button
                  onClick={() => setGame({ gameId: g.gameId, gameName: g.gameName })}
                  className={`text-left px-3.5 py-2.5 rounded-card border transition-colors ${
                    gameId === g.gameId
                      ? "border-accent bg-accent/10 text-text-primary"
                      : "border-border-subtle bg-bg-raised text-text-secondary"
                  }`}
                >
                  {g.gameName}
                </button>
              </Dialog.Close>
            ))}
          </div>
        </BottomSheet>
      </div>

      {/* Desktop: anchored popover */}
      <div className="hidden lg:block">
        <GameSelectPopover
          games={games}
          selectedGameId={gameId}
          onSelect={(g) => setGame({ gameId: g.gameId, gameName: g.gameName })}
          trigger={triggerButton}
        />
      </div>
    </div>
  );
}
