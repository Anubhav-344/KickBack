// src/features/resources/pages/ResourceSelectionPage.tsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ResourceSelectionSkeleton } from "../components/ResourceSelectionSkeleton";
import ResourceBreadcrumb from "../components/ResourceBreadcrumb";
import ResourceUnitCard from "../components/ResourceUnitCard";
import GameFilter from "../components/GameFilter";
import { useCafeDetails } from "@/features/cafe/hooks/useCafeDetails";
import { useResources } from "../hooks/useResources";

export default function ResourceSelectionPage() {
  const { cafeSlug, resourceTypeId } = useParams();
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

  const typeId = Number(resourceTypeId);
  const { data: cafe, isLoading: cafeLoading } = useCafeDetails(cafeSlug);
  const { data: units, isLoading: unitsLoading } = useResources(cafeSlug, typeId);

  const currentResourceType = cafe?.resourceTypes.find((rt) => rt.resourceTypeId === typeId);
  const isLoading = cafeLoading || unitsLoading;

  if (isLoading) {
    return (
      <PageShell>
        <Header />
        <ResourceSelectionSkeleton />
        <Footer />
      </PageShell>
    );
  }

  if (!cafe || !currentResourceType) {
    return (
      <PageShell>
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-sm text-text-secondary mb-5">
            This resource type couldn&apos;t be found.
          </p>
          <Link
            to={cafe ? `/cafes/${cafe.slug}` : "/"}
            className="text-sm font-semibold text-accent-text border border-accent/40 rounded-md px-4 py-2"
          >
            {cafe ? "Back to Caf\u00E9" : "Back to Discovery"}
          </Link>
        </div>
        <Footer />
      </PageShell>
    );
  }

  const allUnits = units ?? [];

  // Dedupe games by gameId across all units of this type.
  const allGames = Array.from(
    new Map(allUnits.flatMap((u) => u.games ?? []).map((g) => [g.gameId, g])).values()
  );

  const filteredUnits = selectedGameId
    ? allUnits.filter((u) => u.games?.some((g) => g.gameId === selectedGameId))
    : allUnits;

  return (
    <PageShell title={`${currentResourceType.resourceName} at ${cafe.name}`}>
      <Header />

      <h1 className="sr-only">
        {currentResourceType.resourceName} at {cafe.name}
      </h1>

      <ResourceBreadcrumb
        cafeName={cafe.name}
        currentResourceType={currentResourceType}
        allResourceTypes={cafe.resourceTypes}
      />

      <div className="flex items-center justify-between px-4 lg:px-8 pt-4 pb-2 border-t border-border-subtle mt-4">
        <span className="text-sm lg:text-base font-medium text-text-secondary">Filters</span>
        <GameFilter
          games={allGames}
          selectedGameId={selectedGameId}
          onSelect={setSelectedGameId}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 px-4 lg:px-8 pb-5">
        {filteredUnits.map((unit) => (
          <ResourceUnitCard key={unit.resourceId} unit={unit} />
        ))}
      </div>

      <Footer cafeName={cafe.name} locationLabel={cafe.address.city} />
    </PageShell>
  );
}
