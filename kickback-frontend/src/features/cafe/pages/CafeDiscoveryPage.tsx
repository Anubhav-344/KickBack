// src/features/cafe/pages/CafeDiscoveryPage.tsx
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CafeListingCard from "../components/CafeListingCard";
import ResourceTypeFilterChips from "../components/ResourceTypeFilterChips";
import { computeCafeOpenStatus } from "@/lib/cafeStatus";
import type { CafeListing } from "../types";

// TEMPORARY mock — replace with useCafeListings() (React Query, GET /cafes),
// scoped to the fixed city for now since there's no geolocation/search-by-
// location — see design notes on skipping permission prompts entirely.
const MOCK_CAFES: CafeListing[] = [
  {
    cafeId: 1,
    slug: "respawn-lounge",
    name: "Respawn Lounge",
    area: "MP Nagar",
    city: "Bhopal",
    averageRating: 4.6,
    totalReviews: 128,
    startingHourlyRate: 120,
    resourceTypeTags: ["PS5", "VR", "Pool", "PC", "Snooker"],
    todayOperatingWindow: { openingMinutes: 10 * 60, closingMinutes: 23 * 60, isClosedToday: false },
  },
  {
    cafeId: 2,
    slug: "pixel-arena",
    name: "Pixel Arena",
    area: "Arera Colony",
    city: "Bhopal",
    averageRating: 4.3,
    totalReviews: 64,
    startingHourlyRate: 100,
    resourceTypeTags: ["PC", "Racing Sim"],
    todayOperatingWindow: { openingMinutes: 11 * 60, closingMinutes: 22 * 60, isClosedToday: false },
  },
  {
    cafeId: 3,
    slug: "gg-gaming-hub",
    name: "GG Gaming Hub",
    area: "Kolar Road",
    city: "Bhopal",
    averageRating: 4.1,
    totalReviews: 41,
    startingHourlyRate: 130,
    resourceTypeTags: ["PS5", "Snooker"],
    todayOperatingWindow: { openingMinutes: 17 * 60, closingMinutes: 24 * 60, isClosedToday: false },
  },
  {
    cafeId: 4,
    slug: "level-up-cafe",
    name: "Level Up Caf\u00E9",
    area: "New Market",
    city: "Bhopal",
    averageRating: 4.4,
    totalReviews: 89,
    startingHourlyRate: 110,
    resourceTypeTags: ["PS5", "PC", "VR"],
    todayOperatingWindow: { openingMinutes: 0, closingMinutes: 0, isClosedToday: true },
  },
];

export default function CafeDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [openNowOnly, setOpenNowOnly] = useState(false);

  const availableTypes = useMemo(
    () => Array.from(new Set(MOCK_CAFES.flatMap((c) => c.resourceTypeTags))).sort(),
    []
  );

  const toggleType = (type: string) =>
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  const filteredAndSortedCafes = useMemo(() => {
    const filtered = MOCK_CAFES.filter((cafe) => {
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
  }, [searchQuery, selectedTypes, openNowOnly]);

  return (
    <PageShell>
      <Header />

      <div className="px-4 pt-4">
        <h1 className="font-display font-semibold text-[26px] text-text-primary">
          Find your next session
        </h1>
        <p className="text-[13px] text-text-secondary mt-1">
          Gaming caf&eacute;s in Bhopal, ready to book
        </p>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center gap-2.5 bg-bg-surface border border-border-subtle rounded-card px-3.5 py-3">
          <Search size={15} className="text-text-secondary" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search caf\u00E9s, games, areas..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none"
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

      <div className="text-xs uppercase tracking-wide text-text-secondary px-4 pb-2.5">
        {filteredAndSortedCafes.length}{" "}
        {filteredAndSortedCafes.length === 1 ? "caf\u00E9" : "caf\u00E9s"} in Bhopal
      </div>

      <div className="flex flex-col gap-3 px-4 pb-6">
        {filteredAndSortedCafes.length === 0 ? (
          <div className="text-sm text-text-secondary text-center py-10">
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
