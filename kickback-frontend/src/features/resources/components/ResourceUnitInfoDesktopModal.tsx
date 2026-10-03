// src/features/resources/components/ResourceUnitInfoDesktopModal.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import type { ResourceUnit } from "../types";

interface ResourceUnitInfoDesktopModalProps {
  unit: ResourceUnit;
  trigger: ReactNode;
}

// Desktop-only counterpart to the unit card's mobile bottom sheet. This is
// a detail view (not a quick selection), and the trigger is a tiny "i"
// button inside a card that can sit in any grid column — so a centered
// modal avoids the edge-of-screen positioning problems an anchored popover
// would have, and gives the details room to breathe instead of the cramped
// list used on mobile.
export default function ResourceUnitInfoDesktopModal({
  unit,
  trigger,
}: ResourceUnitInfoDesktopModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden z-50">
          {unit.imageUrl && (
            <div className="h-48 bg-gradient-to-br from-bg-raised to-bg-surface overflow-hidden">
              <img
                src={unit.imageUrl}
                alt={unit.resourceName}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-7">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="font-display font-semibold text-2xl text-text-primary">
                {unit.resourceName}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  aria-label="Close"
                  className="w-9 h-9 rounded-full bg-bg-raised flex items-center justify-center text-text-secondary"
                >
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex flex-col gap-4">
              {unit.brand && <InfoRow label="Brand" value={unit.brand} />}
              {unit.maxPlayers && (
                <InfoRow label="Players" value={`Up to ${unit.maxPlayers}`} />
              )}
              {unit.games && unit.games.length > 0 && (
                <InfoRow
                  label="Games"
                  value={unit.games.map((g) => g.gameName).join(", ")}
                />
              )}
              {unit.description && <InfoRow label="Specs" value={unit.description} />}
              <InfoRow label="Rate" value={`\u20B9${unit.hourlyRate}/hr`} />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-text-secondary mb-1">{label}</div>
      <div className="text-base text-text-primary">{value}</div>
    </div>
  );
}
