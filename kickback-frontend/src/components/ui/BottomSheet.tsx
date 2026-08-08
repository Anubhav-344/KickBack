// src/components/ui/BottomSheet.tsx
import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

interface BottomSheetProps {
  trigger: ReactNode;
  title?: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Shared bottom-sheet shell. Used by: BookResourceTypeModal (resource-type
 * quick-pick), ResourceUnitCard's info popup, and GameFilter. Keeping this
 * as one primitive means the sheet's positioning, backdrop, and handle
 * styling only need fixing in one place if we ever tweak it.
 */
export default function BottomSheet({
  trigger,
  title,
  children,
  open,
  onOpenChange,
}: BottomSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-30" />
        <Dialog.Content
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app
                     bg-bg-surface border border-border-subtle border-b-0
                     rounded-t-[20px] p-4 pb-6 z-40 shadow-surface-raised
                     max-h-[85vh] overflow-y-auto"
        >
          <div className="w-9 h-1 bg-border-subtle rounded-full mx-auto mb-3.5" />
          {title && (
            <Dialog.Title className="font-display font-semibold text-lg text-text-primary mb-3.5">
              {title}
            </Dialog.Title>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
