// src/features/resources/hooks/useResources.ts
import { useQuery } from "@tanstack/react-query";
import { resourceApi } from "../api";

// LIVE — GET /api/cafes/{slug}/resources?resourceTypeId=
export function useResources(cafeSlug: string | undefined, resourceTypeId: number | undefined) {
  return useQuery({
    queryKey: ["resources", cafeSlug, resourceTypeId],
    queryFn: () => resourceApi.listByType(cafeSlug!, resourceTypeId),
    enabled: !!cafeSlug && !!resourceTypeId,
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
