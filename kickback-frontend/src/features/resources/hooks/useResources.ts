// src/features/resources/hooks/useResources.ts
import { useQuery } from "@tanstack/react-query";
import { resourceApi } from "../api";

// LIVE — GET /api/cafes/{slug}/resources?resourceTypeId=
//
// Each unit's status now reflects real bookings ("In use now" + "Next free
// at"), which goes stale as time passes — so this list refetches every
// minute, on window focus, and always on mount (coming back to this page
// after booking or cancelling shows fresh data, not a cached copy).
export function useResources(cafeSlug: string | undefined, resourceTypeId: number | undefined) {
  return useQuery({
    queryKey: ["resources", cafeSlug, resourceTypeId],
    queryFn: () => resourceApi.listByType(cafeSlug!, resourceTypeId),
    enabled: !!cafeSlug && !!resourceTypeId,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });
}

// LIVE — GET /api/resources/{resourceId}
export function useResourceUnit(resourceId: number | undefined) {
  return useQuery({
    queryKey: ["resource-unit", resourceId],
    queryFn: () => resourceApi.getById(resourceId!),
    enabled: !!resourceId,
    retry: false,
  });
}