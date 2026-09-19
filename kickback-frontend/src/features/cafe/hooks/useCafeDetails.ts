// src/features/cafe/hooks/useCafeDetails.ts
import { useQuery } from "@tanstack/react-query";
import { cafeApi } from "../api";

// LIVE — GET /api/cafes/{slug}
// The backend returns 404 for an unknown slug, which React Query surfaces
// as isError — CafeLandingPage already renders its "not found" state from
// that, so no special-casing is needed here.
export function useCafeDetails(slug: string | undefined) {
  return useQuery({
    queryKey: ["cafe", slug],
    queryFn: () => cafeApi.getCafeBySlug(slug!),
    enabled: !!slug,
    retry: false, // don't retry a 404
  });
}
