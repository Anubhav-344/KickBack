// src/features/cafe/components/ResourceTypeFilterChips.tsx

interface ResourceTypeFilterChipsProps {
  availableTypes: string[];
  selectedTypes: string[];
  onToggleType: (type: string) => void;
  onClearTypes: () => void;
  openNowOnly: boolean;
  onToggleOpenNow: () => void;
}

export default function ResourceTypeFilterChips({
  availableTypes,
  selectedTypes,
  onToggleType,
  onClearTypes,
  openNowOnly,
  onToggleOpenNow,
}: ResourceTypeFilterChipsProps) {
  const isAllActive = selectedTypes.length === 0;

  return (
    <div className="flex gap-2 overflow-x-auto w-full min-w-0 px-4 lg:px-8 pb-4 [&::-webkit-scrollbar]:hidden">
      <Chip label="All" active={isAllActive} onClick={onClearTypes} />
      {availableTypes.map((type) => (
        <Chip
          key={type}
          label={type}
          active={selectedTypes.includes(type)}
          onClick={() => onToggleType(type)}
        />
      ))}
      {/* Visual separator — "Open now" is an independent toggle (can combine
          with "All" or any specific type), not part of the type-selection
          group above, so it shouldn't look like it belongs to that radio-like set. */}
      <div className="w-px bg-border-subtle flex-shrink-0 my-1" />
      <Chip label="Open now" active={openNowOnly} onClick={onToggleOpenNow} />
    </div>
  );
}

function Chip({
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
      onClick={onClick}
      className={`flex-shrink-0 text-sm font-medium rounded-pill px-4 py-2 border transition-colors ${
        active
          ? "bg-accent text-bg-base border-accent"
          : "bg-bg-surface text-text-primary border-border-subtle"
      }`}
    >
      {label}
    </button>
  );
}
