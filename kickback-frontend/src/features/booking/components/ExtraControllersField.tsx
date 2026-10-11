// src/features/booking/components/ExtraControllersField.tsx
import { useId } from "react";
import { useBookingDraftStore, type ExtraControllers } from "../store/useBookingDraftStore";

interface ExtraControllersFieldProps {
  /** Whether this unit lists any games. Units with none fall back to the unit's own player limit. */
  hasGames: boolean;
  unitMaxPlayers?: number;
  /** Rupees for ONE extra controller per hour. 0 or missing means free. */
  extraControllerRate?: number;
}

const fieldClass =
  "w-full bg-bg-surface border border-border-strong rounded-card px-3.5 py-3 text-sm lg:text-base text-text-primary disabled:opacity-60 disabled:cursor-not-allowed";

/**
 * "Need extra controllers?" — one controller is already part of every booking, so this
 * only counts the ones on top. The limit depends on the game (players differ per game),
 * so the dropdown stays off until a game is picked.
 */
export default function ExtraControllersField({
  hasGames,
  unitMaxPlayers,
  extraControllerRate = 0,
}: ExtraControllersFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const gameId = useBookingDraftStore((s) => s.gameId);
  const gameMaxPlayers = useBookingDraftStore((s) => s.gameMaxPlayers);
  const value = useBookingDraftStore((s) => s.extraControllers);
  const setValue = useBookingDraftStore((s) => s.setExtraControllers);

  const needsGame = hasGames && gameId === null;

  // Players the booking can seat: the game's limit, capped by what the unit holds.
  const limits = [gameMaxPlayers, unitMaxPlayers].filter((n): n is number => typeof n === "number");
  const maxPlayers = limits.length > 0 ? Math.max(1, Math.min(...limits)) : 1;
  const singlePlayer = !needsGame && maxPlayers <= 1;
  const disabled = needsGame || singlePlayer;
  const maxExtra = maxPlayers - 1;

  let hint: string;
  if (needsGame) {
    hint = "Pick a game first. The number of players is different for every game.";
  } else if (singlePlayer) {
    hint = "This is a single-player game, so the controller included is all you need.";
  } else {
    const price =
      extraControllerRate > 0
        ? `Each extra controller costs \u20B9${extraControllerRate} per hour.`
        : "There is no extra charge for them.";
    hint = `This game takes up to ${maxPlayers} players, so you can add up to ${maxExtra} extra. ${price}`;
  }

  const options: { value: string; label: string }[] = [{ value: "0", label: "No, 1 controller is enough" }];
  for (let n = 1; n <= maxExtra; n++) {
    const cost = extraControllerRate > 0 ? `, +\u20B9${n * extraControllerRate}/hr` : "";
    options.push({ value: String(n), label: `${n} extra (${n + 1} players${cost})` });
  }
  options.push({
    value: "UNSURE",
    label: "Not sure, I'll decide at the café",
  });

  const selectValue = disabled ? "0" : String(value);

  const onChange = (raw: string) => {
    const next: ExtraControllers = raw === "UNSURE" ? "UNSURE" : Number(raw);
    setValue(next);
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-xs text-text-secondary mb-0.5">
        Need extra controllers?
      </label>
      <p className="text-xs text-text-secondary mb-1.5">
        1 controller is already included in your booking. Add more if friends are joining you.
      </p>
      <select
        id={id}
        value={selectValue}
        disabled={disabled}
        aria-describedby={hintId}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      >
        {needsGame ? (
          <option value="0">Select a game first</option>
        ) : singlePlayer ? (
          <option value="0">Not needed</option>
        ) : (
          options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))
        )}
      </select>
      <p id={hintId} className="text-xs text-text-secondary mt-1.5">
        {hint}
      </p>
    </div>
  );
}
