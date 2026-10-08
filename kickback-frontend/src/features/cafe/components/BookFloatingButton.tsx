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
          <button className="absolute right-5 lg:right-10 bottom-0 lg:bottom-2 pointer-events-auto bg-accent text-on-accent font-semibold text-sm lg:text-base px-6 lg:px-9 py-3.5 lg:py-5 rounded-pill shadow-accent-glow">
            Book now
          </button>
        }
      />
    </FixedBottomSlot>
  );
}
