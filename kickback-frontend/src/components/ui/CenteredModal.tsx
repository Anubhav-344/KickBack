// src/components/ui/CenteredModal.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type ModalSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

interface CenteredModalProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: ModalSize;
}

/**
 * Desktop counterpart to BottomSheet — same props, so a component can swap
 * one for the other. A centered dialog with a dimmed backdrop and a close
 * button, for confirmations and small forms where an anchored popover
 * doesn't fit (there's no natural anchor, or the content needs room).
 *
 * IMPORTANT when pairing with BottomSheet: Radix renders dialog content in
 * a portal, i.e. OUTSIDE any `lg:hidden` / `hidden lg:block` wrapper, so
 * hiding one version with CSS does NOT stop it from rendering if its `open`
 * is true. If you control `open`, give the sheet and the modal their own
 * separate state — sharing one flag would open both at once.
 */
export default function CenteredModal({
  trigger,
  title,
  children,
  open,
  onOpenChange,
  size = "md",
}: CenteredModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content
          aria-describedby={undefined}
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${SIZE_CLASSES[size]} bg-bg-surface border border-border-subtle rounded-2xl p-7 z-50`}
        >
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="font-display font-semibold text-2xl text-text-primary">
              {title}
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

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
