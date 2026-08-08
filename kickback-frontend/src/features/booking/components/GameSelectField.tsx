// src/features/booking/components/GameSelectField.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { Gamepad2, ChevronDown } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import { useBookingDraftStore } from "../store/useBookingDraftStore";

interface GameSelectFieldProps {
  games: string[];
}

export default function GameSelectField({ games }: GameSelectFieldProps) {
  const game = useBookingDraftStore((s) => s.game);
  const setGame = useBookingDraftStore((s) => s.setGame);

  if (games.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="text-xs text-text-secondary mb-1.5">Game</div>
      <BottomSheet
        title="Choose a game"
        trigger={
          <button className="flex items-center justify-between w-full bg-bg-surface border border-border-subtle rounded-card px-3.5 py-3">
            <span className="flex items-center gap-2.5">
              <span className="w-[30px] h-[30px] rounded-lg bg-bg-raised flex items-center justify-center">
                <Gamepad2 size={14} className="text-text-primary" />
              </span>
              <span className="font-display font-semibold text-base text-text-primary">
                {game ?? "Select a game"}
              </span>
            </span>
            <ChevronDown size={16} className="text-text-secondary" />
          </button>
        }
      >
        <div className="flex flex-col gap-2">
          {games.map((g) => (
            <Dialog.Close asChild key={g}>
              <button
                onClick={() => setGame(g)}
                className={`text-left px-3.5 py-2.5 rounded-card border transition-colors ${
                  game === g
                    ? "border-accent bg-accent/10 text-text-primary"
                    : "border-border-subtle bg-bg-raised text-text-secondary"
                }`}
              >
                {g}
              </button>
            </Dialog.Close>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
