// src/features/cafe/hooks/useCafeListings.ts
import { useQuery } from "@tanstack/react-query";
import { cafeApi } from "../api";

// LIVE — GET /api/cafes
export function useCafeListings(city?: string) {
  return useQuery({
    queryKey: ["cafes", city ?? "all"],
    queryFn: () => cafeApi.listCafes(city),
  });
}
