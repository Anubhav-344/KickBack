// src/features/cafe/hooks/useCafeListing.ts
import { useQuery } from "@tanstack/react-query";
import { getCafes } from "@/features/cafe/api";

export function useCafeListings(city = "Bhopal") {
  return useQuery({
    queryKey: ["cafes", city],
    queryFn: () => getCafes(city),
  });
}
