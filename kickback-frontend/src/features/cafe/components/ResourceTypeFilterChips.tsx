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
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 [&::-webkit-scrollbar]:hidden">
        <Chip label="All" active={isAllActive} onClick={onClearTypes} />
        {availableTypes.map((type) => (
          <Chip
            key={type}
            label={type}
            active={selectedTypes.includes(type)}
            onClick={() => onToggleType(type)}
          />
        ))}
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
        className={`flex-shrink-0 text-xs font-medium rounded-pill px-3.5 py-1.5 border transition-colors ${
          active
            ? "bg-accent text-bg-base border-accent"
            : "bg-bg-surface text-text-primary border-border-subtle"
        }`}
      >
        {label}
      </button>
    );
  }
  