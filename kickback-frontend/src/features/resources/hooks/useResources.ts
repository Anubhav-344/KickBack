// src/features/resources/hooks/useResources.ts
import { useQuery } from "@tanstack/react-query";
import { getUnitsByResourceType, getUnitById } from "@/mocks/cafes";
import { mockDelay } from "@/lib/mockDelay";

// Units for a resource-type grid (resource selection page).
export function useResources(cafeSlug: string | undefined, resourceTypeId: number | undefined) {
  return useQuery({
    queryKey: ["resources", cafeSlug, resourceTypeId],
    queryFn: () =>
      mockDelay(
        cafeSlug && resourceTypeId ? getUnitsByResourceType(cafeSlug, resourceTypeId) : []
      ),
    enabled: !!cafeSlug && !!resourceTypeId,
  });
}

// A single unit (booking page, which only has :resourceId in its URL).
export function useResourceUnit(resourceId: number | undefined) {
  return useQuery({
    queryKey: ["resource-unit", resourceId],
    queryFn: () => mockDelay(resourceId ? getUnitById(resourceId) ?? null : null),
    enabled: !!resourceId,
  });
}
