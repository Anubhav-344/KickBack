// src/features/cafe/hooks/useCafeListings.ts
import { useQuery } from "@tanstack/react-query";
import { getAllCafes, toCafeListing } from "@/mocks/cafes";
import { mockDelay } from "@/lib/mockDelay";

// TEMPORARY: swap queryFn's body for `axiosClient.get("/cafes")` once the
// backend exists — queryKey and return shape (CafeListing[]) already match
// what CafeDiscoveryPage expects, so nothing else needs to change.
export function useCafeListings() {
  return useQuery({
    queryKey: ["cafes"],
    queryFn: () => mockDelay(getAllCafes().map(toCafeListing)),
  });
}
