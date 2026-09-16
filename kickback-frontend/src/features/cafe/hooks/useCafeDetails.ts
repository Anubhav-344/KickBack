import { useQuery } from "@tanstack/react-query";
import { getCafeDetails } from "../api";

export function useCafeDetails(slug: string | undefined) {
  return useQuery({
    queryKey: ["cafe", slug],
    queryFn: () => (slug ? getCafeDetails(slug) : null),
    enabled: !!slug,
  });
}
