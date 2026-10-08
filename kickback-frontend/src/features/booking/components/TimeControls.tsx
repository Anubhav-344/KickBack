// src/features/booking/components/TimeControls.tsx
import { useState } from "react";

// Shared by StartTimeInput and EndTimeEditSheet. The two used to carry their
// own copies of this markup, which is how they drifted apart before.

interface TimeStepperBlockProps {
  /** Small-caps label shown above the value, e.g. "HOUR". */
  label: string;
  /** How a screen reader should name it, e.g. "hour" -> "Increase hour". */
  spokenLabel: string;
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
  /** Called with the number the user typed (already clamped to min..max). */
  onSet: (value: number) => void;
  min: number;
  max: number;
}

export function TimeStepperBlock({
  label,
  spokenLabel,
  value,
  onDecrement,
  onIncrement,
  onSet,
  min,
  max,
}: TimeStepperBlockProps) {
  return (
    <div
      role="group"
      aria-label={spokenLabel}
      className="flex-1 bg-bg-surface border border-border-subtle rounded-card p-2.5"
    >
      <div aria-hidden="true" className="text-[10px] text-text-secondary text-center mb-1">
        {label}
      </div>
      <div className="flex items-center justify-between">
        <StepperButton
          onClick={onDecrement}
          symbol={"\u2212"}
          ariaLabel={`Decrease ${spokenLabel}`}
        />
        <TimeNumberInput
          value={value}
          spokenLabel={spokenLabel}
          min={min}
          max={max}
          onSet={onSet}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
        />
        <StepperButton onClick={onIncrement} symbol="+" ariaLabel={`Increase ${spokenLabel}`} />
      </div>
    </div>
  );
}

// The number between the - and + buttons is a real text field, so a time can be
// typed ("40") instead of clicking + forty times. While focused it shows what
// is being typed; the value is applied (and clamped to min..max) when the
// field loses focus or Enter is pressed. Arrow Up/Down still step it.
function TimeNumberInput({
  value,
  spokenLabel,
  min,
  max,
  onSet,
  onDecrement,
  onIncrement,
}: {
  value: string;
  spokenLabel: string;
  min: number;
  max: number;
  onSet: (value: number) => void;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  const [typed, setTyped] = useState<string | null>(null);

  const commit = () => {
    if (typed !== null && typed !== "") {
      const n = Math.min(max, Math.max(min, parseInt(typed, 10)));
      if (!Number.isNaN(n)) onSet(n);
    }
    setTyped(null);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      aria-label={`${spokenLabel} (${min} to ${max})`}
      value={typed ?? value}
      onFocus={(e) => {
        setTyped(value);
        e.target.select();
      }}
      onChange={(e) => setTyped(e.target.value.replace(/\D/g, "").slice(0, 2))}
      onBlur={commit}
      onKeyDown={(e) => {
        const input = e.currentTarget;
        if (/^\d$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
          // Typing a digit with nothing selected (or a full 2-digit value) starts a
          // fresh number instead of being ignored or appended to the old one.
          const replacing = input.selectionStart !== input.selectionEnd;
          if (typed === null || (!replacing && typed.length >= 2)) {
            e.preventDefault();
            setTyped(e.key);
          }
        } else if (e.key === "Enter") {
          commit();
          input.select();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setTyped(null);
          onIncrement();
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          setTyped(null);
          onDecrement();
        } else if (e.key === "Escape") {
          setTyped(null);
        }
      }}
      className="w-12 text-center font-semibold text-base text-text-primary tabular-nums bg-transparent rounded-md focus:bg-bg-raised"
    />
  );
}

// The button looks 22px but the invisible ::before grows the clickable area
// to ~34px (WCAG 2.2 asks for at least 24px), without changing the layout.
function StepperButton({
  onClick,
  symbol,
  ariaLabel,
}: {
  onClick: () => void;
  symbol: string;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="relative w-[22px] h-[22px] rounded-md bg-bg-raised flex items-center justify-center text-xs font-semibold text-text-primary before:content-[''] before:absolute before:-inset-1.5"
    >
      <span aria-hidden="true">{symbol}</span>
    </button>
  );
}

export function AmPmToggle({
  isPM,
  onChange,
}: {
  isPM: boolean;
  onChange: (pm: boolean) => void;
}) {
  return (
    <div
      role="group"
      aria-label="AM or PM"
      className="flex-none w-16 bg-bg-surface border border-border-subtle rounded-card p-2.5 flex flex-col gap-1"
    >
      <AmPmButton label="AM" active={!isPM} onClick={() => onChange(false)} />
      <AmPmButton label="PM" active={isPM} onClick={() => onChange(true)} />
    </div>
  );
}

function AmPmButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`text-center text-xs font-semibold py-1.5 rounded-md transition-colors ${
        active ? "bg-accent text-on-accent" : "text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}
