// src/features/resources/pages/ResourceSelectionPage.tsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ResourceBreadcrumb from "../components/ResourceBreadcrumb";
import ResourceUnitCard from "../components/ResourceUnitCard";
import GameFilter from "../components/GameFilter";
import { getCafeBySlug, getUnitsByResourceType, getResourceTypeById } from "@/mocks/cafes";

export default function ResourceSelectionPage() {
  const { cafeSlug, resourceTypeId } = useParams();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const cafe = cafeSlug ? getCafeBySlug(cafeSlug) : undefined;
  const typeId = Number(resourceTypeId);
  const currentResourceType = cafeSlug ? getResourceTypeById(cafeSlug, typeId) : undefined;
  const units = cafeSlug ? getUnitsByResourceType(cafeSlug, typeId) : [];

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
            className="text-sm font-semibold text-accent-hover border border-accent/40 rounded-md px-4 py-2"
          >
            {cafe ? "Back to Caf\u00E9" : "Back to Discovery"}
          </Link>
        </div>
        <Footer />
      </PageShell>
    );
  }

  const allGames = Array.from(new Set(units.flatMap((u) => u.games ?? [])));
  const filteredUnits = selectedGame
    ? units.filter((u) => u.games?.includes(selectedGame))
    : units;

  return (
    <PageShell>
      <Header />

      <ResourceBreadcrumb
        cafeName={cafe.name}
        currentResourceType={currentResourceType}
        allResourceTypes={cafe.resourceTypes}
      />

      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <span className="text-sm font-medium text-text-secondary">Filters</span>
        <GameFilter
          games={allGames}
          selectedGame={selectedGame}
          onSelect={setSelectedGame}
        />
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-5">
        {filteredUnits.map((unit) => (
          <ResourceUnitCard key={unit.resourceId} unit={unit} />
        ))}
      </div>

      <Footer cafeName={cafe.name} locationLabel={cafe.address.city} />
    </PageShell>
  );
}
