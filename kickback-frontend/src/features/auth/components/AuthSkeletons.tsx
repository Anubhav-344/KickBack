// src/features/auth/components/AuthSkeletons.tsx
import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";

// Mirrors BookingListCard: café + unit + status, date line, amount row.
function BookingCardSkeleton() {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-card p-3.5 lg:p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-5 lg:h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3 mt-1.5" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/5 mt-3" />
      <div className="flex items-center justify-between mt-3">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

/** Placeholder cards for My Bookings. A single grid item spanning the whole row. */
export function BookingListSkeleton() {
  return (
    <LoadingRegion
      label="Loading your bookings"
      className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5"
    >
      {Array.from({ length: 4 }, (_, i) => (
        <BookingCardSkeleton key={i} />
      ))}
    </LoadingRegion>
  );
}

/** Avatar picker + the form fields, for the Profile page. */
export function ProfileSkeleton() {
  return (
    <LoadingRegion label="Loading your profile">
      <div className="flex items-center gap-3 mb-6">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="w-12 h-12 lg:w-14 lg:h-14 rounded-full" />
        ))}
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-[68px] flex-1 rounded-card" />
        <Skeleton className="h-[68px] flex-1 rounded-card" />
      </div>
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} className="h-[68px] w-full mt-3 rounded-card" />
      ))}
      <Skeleton className="h-12 w-full mt-6 rounded-card" />
    </LoadingRegion>
  );
}