// src/features/cafe/pages/CafeDiscoveryPage.tsx
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/Skeleton";
import { CafeListingSkeleton } from "../components/CafeSkeletons";
import CafeListingCard from "../components/CafeListingCard";
import ResourceTypeFilterChips from "../components/ResourceTypeFilterChips";
import { computeCafeOpenStatus } from "@/lib/cafeStatus";
import { useCafeListings } from "../hooks/useCafeListing";

export default function CafeDiscoveryPage() {
  const { data: cafes, isLoading, isError } = useCafeListings();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [openNowOnly, setOpenNowOnly] = useState(false);

  const availableTypes = useMemo(
    () => Array.from(new Set((cafes ?? []).flatMap((c) => c.resourceTypeTags))).sort(),
    [cafes]
  );

  const toggleType = (type: string) =>
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  const filteredAndSortedCafes = useMemo(() => {
    if (!cafes) return [];

    const filtered = cafes.filter((cafe) => {
      const matchesSearch =
        !searchQuery.trim() ||
        cafe.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        cafe.area.toLowerCase().includes(searchQuery.trim().toLowerCase());

      const matchesTypes =
        selectedTypes.length === 0 ||
        selectedTypes.every((type) => cafe.resourceTypeTags.includes(type));

      const status = computeCafeOpenStatus(cafe.todayOperatingWindow);
      const matchesOpenNow = !openNowOnly || status.isOpenNow;

      return matchesSearch && matchesTypes && matchesOpenNow;
    });

    // Open cafés first, closed/opens-later ones sink to the bottom.
    return [...filtered].sort((a, b) => {
      const aOpen = computeCafeOpenStatus(a.todayOperatingWindow).isOpenNow;
      const bOpen = computeCafeOpenStatus(b.todayOperatingWindow).isOpenNow;
      return aOpen === bOpen ? 0 : aOpen ? -1 : 1;
    });
  }, [cafes, searchQuery, selectedTypes, openNowOnly]);

  return (
    <PageShell title="Find a gaming café">
      <Header />

      <div className="px-4 lg:px-8 pt-4 lg:pt-10">
        <h1 className="font-display font-semibold text-[26px] lg:text-4xl text-text-primary">
          Find your next session
        </h1>
        <p className="text-[13px] lg:text-base text-text-secondary mt-1 lg:mt-2">
          Gaming caf&eacute;s in Bhopal, ready to book
        </p>
      </div>

      <div className="px-4 lg:px-8 py-4 lg:py-6">
        <div className="flex items-center gap-2.5 bg-bg-surface border border-border-strong rounded-card px-3.5 lg:px-5 py-3 lg:py-4 lg:max-w-xl focus-within:border-accent focus-within:outline-2 focus-within:outline-accent focus-within:outline-offset-2">
          <Search size={15} className="text-text-secondary lg:w-[18px] lg:h-[18px]" />
          <input
            aria-label="Search cafés or areas"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cafés or areas..."
            className="flex-1 bg-transparent text-sm lg:text-base text-text-primary placeholder:text-text-secondary focus:outline-none"
          />
        </div>
      </div>

      <ResourceTypeFilterChips
        availableTypes={availableTypes}
        selectedTypes={selectedTypes}
        onToggleType={toggleType}
        onClearTypes={() => setSelectedTypes([])}
        openNowOnly={openNowOnly}
        onToggleOpenNow={() => setOpenNowOnly((v) => !v)}
      />

      <div className="text-xs uppercase tracking-wide text-text-secondary px-4 lg:px-8 pb-2.5">
        {isLoading
          ? <Skeleton className="h-4 w-28" />
          : `${filteredAndSortedCafes.length} ${filteredAndSortedCafes.length === 1 ? "caf\u00E9" : "caf\u00E9s"} in Bhopal`}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 px-4 lg:px-8 pb-6">
        {isLoading ? (
          <CafeListingSkeleton />
        ) : isError ? (
          <div className="col-span-full text-sm text-state-error text-center py-10">
            Couldn&apos;t load caf&eacute;s. Please try again.
          </div>
        ) : filteredAndSortedCafes.length === 0 ? (
          <div className="col-span-full text-sm text-text-secondary text-center py-10">
            No caf&eacute;s match your filters.
          </div>
        ) : (
          filteredAndSortedCafes.map((cafe) => (
            <CafeListingCard key={cafe.cafeId} cafe={cafe} />
          ))
        )}
      </div>

      <Footer />
    </PageShell>
  );
}