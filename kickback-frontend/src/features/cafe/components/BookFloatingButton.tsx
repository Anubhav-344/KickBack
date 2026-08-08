// src/features/cafe/components/BookFloatingButton.tsx
import FixedBottomSlot from "@/components/layout/FixedBottomSlot";
import BookResourceTypeModal from "@/features/resources/components/BookResourceTypeModal";
import type { ResourceTypeSummary } from "../types";

interface BookFloatingButtonProps {
  resourceTypes: ResourceTypeSummary[];
}

export default function BookFloatingButton({ resourceTypes }: BookFloatingButtonProps) {
  return (
    <FixedBottomSlot>
      <BookResourceTypeModal
        resourceTypes={resourceTypes}
        trigger={
          <button className="absolute right-5 bottom-0 pointer-events-auto bg-accent text-bg-base font-semibold text-sm px-6 py-3.5 rounded-pill shadow-accent-glow">
            Book now
          </button>
        }
      />
    </FixedBottomSlot>
  );
}
