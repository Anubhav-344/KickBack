// src/features/cafe/components/CafeSkeletons.tsx
import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";

// Mirrors CafeListingCard's dimensions so the grid doesn't jump when real
// cards replace these.
function CafeCardSkeleton() {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden">
      <Skeleton className="h-[120px] lg:h-[260px] rounded-none" />
      <div className="p-3.5 lg:p-5">
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 lg:h-7 w-2/5" />
          <Skeleton className="h-5 w-10" />
        </div>
        <Skeleton className="h-4 w-1/3 mt-2" />
        <div className="flex gap-1.5 mt-3 lg:mt-3.5">
          <Skeleton className="h-6 lg:h-7 w-12 rounded-full" />
          <Skeleton className="h-6 lg:h-7 w-14 rounded-full" />
          <Skeleton className="h-6 lg:h-7 w-10 rounded-full" />
        </div>
        <Skeleton className="h-4 w-2/5 mt-3 lg:mt-3.5" />
      </div>
    </div>
  );
}

/** Placeholder cards for the Discovery grid. It's a single grid item that spans the whole row. */
export function CafeListingSkeleton() {
  return (
    <LoadingRegion
      label="Loading cafés"
      className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
    >
      {Array.from({ length: 4 }, (_, i) => (
        <CafeCardSkeleton key={i} />
      ))}
    </LoadingRegion>
  );
}

/** Whole café detail page body (below the header): hero, name row, resource types, amenities. */
export function CafeLandingSkeleton() {
  return (
    <LoadingRegion label="Loading café">
      <Skeleton className="h-48 sm:h-64 md:h-72 rounded-none" />

      <div className="flex items-center justify-between px-4 lg:px-8 py-3.5 lg:py-6 border-b border-border-subtle">
        <div>
          <Skeleton className="h-7 lg:h-9 w-44 lg:w-64" />
          <Skeleton className="h-4 w-36 lg:w-52 mt-2" />
        </div>
        <div className="flex flex-col items-end">
          <Skeleton className="h-6 lg:h-8 w-14" />
          <Skeleton className="h-4 w-20 mt-1.5" />
        </div>
      </div>

      <div className="px-4 lg:px-8 py-4 border-b border-border-subtle">
        <Skeleton className="h-4 w-28 mb-3" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-[112px] lg:h-[160px] rounded-card" />
          ))}
        </div>
      </div>

      <div className="px-4 lg:px-8 py-4">
        <Skeleton className="h-4 w-24 mb-3" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      </div>
    </LoadingRegion>
  );
}