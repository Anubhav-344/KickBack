// src/features/cafe/hooks/useCafeDetails.ts
import { useQuery } from "@tanstack/react-query";
import { getCafeBySlug } from "@/mocks/cafes";
import { mockDelay } from "@/lib/mockDelay";

// TEMPORARY: swap for `axiosClient.get(`/cafes/${slug}`)`. Returns null
// (not throwing) when not found, so pages can render a "not found" state
// via `data === null` rather than an error boundary.
export function useCafeDetails(slug: string | undefined) {
  return useQuery({
    queryKey: ["cafe", slug],
    queryFn: () => mockDelay(slug ? getCafeBySlug(slug) ?? null : null),
    enabled: !!slug,
  });
}
