// src/features/booking/components/BookingSkeletons.tsx
import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";

/** Booking page: unit header + image, timeline, form fields, and the price/action panel. */
export function BookingPageSkeleton() {
  return (
    <LoadingRegion
      label="Loading booking details"
      className="w-full lg:flex lg:gap-12 px-4 lg:px-10 xl:px-16 py-4 lg:py-10"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-stretch gap-3 lg:gap-6">
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 lg:h-11 w-3/4 mt-3 lg:mt-5" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </div>
          <Skeleton className="w-[84px] h-[84px] lg:w-[220px] lg:h-[220px] rounded-2xl flex-shrink-0" />
        </div>

        <Skeleton className="h-24 w-full mt-6 rounded-card" />

        <div className="mt-6 flex flex-col gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i}>
              <Skeleton className="h-3.5 w-16 mb-2" />
              <Skeleton className="h-[52px] w-full rounded-card" />
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="w-full lg:w-[380px] h-[180px] lg:h-[260px] mt-6 lg:mt-0 lg:flex-shrink-0 rounded-2xl" />
    </LoadingRegion>
  );
}

/** Checkout page: left column (details grid + offer) and the sticky price panel. */
export function BookingPreviewSkeleton() {
  return (
    <LoadingRegion
      label="Loading checkout"
      className="w-full lg:flex lg:gap-12 px-4 lg:px-10 xl:px-16 py-4 lg:py-10"
    >
      <div className="flex-1 min-w-0">
        <Skeleton className="h-8 lg:h-10 w-48" />
        <div className="flex items-center gap-4 lg:gap-6 mt-6">
          <Skeleton className="w-16 h-16 lg:w-24 lg:h-24 rounded-xl flex-shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3 mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:gap-5 mt-8">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-[76px] lg:h-[88px] rounded-card" />
          ))}
        </div>

        <Skeleton className="h-4 w-16 mt-10 mb-3" />
        <Skeleton className="h-16 w-full rounded-card" />
      </div>

      <Skeleton className="w-full lg:w-[440px] h-[320px] lg:h-[420px] mt-8 lg:mt-0 lg:flex-shrink-0 rounded-2xl" />
    </LoadingRegion>
  );
}

/** Confirmation page: check mark, headline, and the booking summary card. */
export function BookingConfirmationSkeleton() {
  return (
    <LoadingRegion
      label="Loading your confirmation"
      className="w-full max-w-md mx-auto px-4 py-10 flex flex-col items-center"
    >
      <Skeleton className="w-16 h-16 rounded-full" />
      <Skeleton className="h-8 w-56 mt-6" />
      <Skeleton className="h-4 w-44 mt-3" />
      <Skeleton className="h-[220px] w-full mt-8 rounded-2xl" />
      <Skeleton className="h-12 w-full mt-6 rounded-card" />
    </LoadingRegion>
  );
}