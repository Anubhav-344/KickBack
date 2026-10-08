// src/features/resources/components/ResourceSelectionSkeleton.tsx
import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";

// Mirrors ResourceUnitCard: image on the left half, details on the right.
function UnitCardSkeleton() {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-card overflow-hidden flex items-stretch">
      <Skeleton className="w-1/2 min-h-[110px] lg:min-h-[160px] rounded-none" />
      <div className="flex-1 p-3 lg:p-5 flex flex-col justify-center gap-2">
        <Skeleton className="h-5 lg:h-6 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

/** Breadcrumb + type switcher + filters row + unit cards, for the Resource Selection page. */
export function ResourceSelectionSkeleton() {
  return (
    <LoadingRegion label="Loading units">
      <div className="px-4 lg:px-8 pt-3.5 lg:pt-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-[56px] lg:h-[74px] w-full lg:max-w-md mt-3 lg:mt-5 rounded-card" />
      </div>

      <div className="flex items-center justify-between px-4 lg:px-8 pt-4 pb-2 border-t border-border-subtle mt-4">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 px-4 lg:px-8 pb-5">
        {Array.from({ length: 4 }, (_, i) => (
          <UnitCardSkeleton key={i} />
        ))}
      </div>
    </LoadingRegion>
  );
}