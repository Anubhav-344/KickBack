// src/features/resources/pages/ResourceSelectionPage.tsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ResourceBreadcrumb from "../components/ResourceBreadcrumb";
import ResourceUnitCard from "../components/ResourceUnitCard";
import GameFilter from "../components/GameFilter";
import type { ResourceUnit } from "../types";
import type { ResourceTypeSummary } from "@/features/cafe/types";

// TEMPORARY: stand-in for real data — replace with:
//   const { data: resourceType } = useResourceType(resourceTypeId)
//   const { data: units } = useResources(resourceTypeId)
//   const { data: allTypes } = useCafeResourceTypes(cafeSlug)  // for the switcher
const MOCK_ALL_TYPES: ResourceTypeSummary[] = [
  { resourceTypeId: 1, resourceName: "PS5", totalUnits: 4, startingHourlyRate: 150, supportsGames: true },
  { resourceTypeId: 2, resourceName: "PC", totalUnits: 6, startingHourlyRate: 120, supportsGames: true },
  { resourceTypeId: 3, resourceName: "VR", totalUnits: 2, startingHourlyRate: 200, supportsGames: true },
  { resourceTypeId: 4, resourceName: "Racing Sim", totalUnits: 2, startingHourlyRate: 250, supportsGames: true },
  { resourceTypeId: 5, resourceName: "8 Ball Pool", totalUnits: 3, startingHourlyRate: 120, supportsGames: false },
  { resourceTypeId: 6, resourceName: "Snooker", totalUnits: 1, startingHourlyRate: 150, supportsGames: false },
  { resourceTypeId: 7, resourceName: "Private Room (PS5)", totalUnits: 1, startingHourlyRate: 350, supportsGames: true },
];

// Keyed by resourceTypeId so switching types in the mock actually shows
// different units — this whole block disappears once useResources(id) exists.
const MOCK_UNITS_BY_TYPE: Record<number, ResourceUnit[]> = {
  1: [
    { resourceId: 1, resourceTypeId: 1, resourceName: "PS5 - Unit 1", brand: "Sony", maxPlayers: 4, status: "AVAILABLE", hourlyRate: 150, description: '55" 4K TV, 2 controllers', games: ["FIFA 24", "GTA V", "God of War"] },
    { resourceId: 2, resourceTypeId: 1, resourceName: "PS5 - Unit 2", brand: "Sony", maxPlayers: 4, status: "BOOKED", hourlyRate: 150, description: '55" 4K TV, 2 controllers', games: ["FIFA 24", "Spider-Man 2"], nextAvailableAt: "4:30 PM" },
    { resourceId: 3, resourceTypeId: 1, resourceName: "PS5 - Unit 3", brand: "Sony", maxPlayers: 4, status: "MAINTENANCE", hourlyRate: 150, description: '55" 4K TV, 2 controllers', games: ["FIFA 24", "GTA V"] },
    { resourceId: 4, resourceTypeId: 1, resourceName: "PS5 - Unit 4", brand: "Sony", maxPlayers: 4, status: "AVAILABLE", hourlyRate: 150, description: '55" 4K TV, 2 controllers', games: ["GTA V", "God of War"] },
  ],
  2: [
    { resourceId: 5, resourceTypeId: 2, resourceName: "PC - Unit 1", brand: "Custom Build", maxPlayers: 1, status: "AVAILABLE", hourlyRate: 120, description: "RTX 4070, 165Hz monitor", games: ["Valorant", "CS2"] },
    { resourceId: 6, resourceTypeId: 2, resourceName: "PC - Unit 2", brand: "Custom Build", maxPlayers: 1, status: "AVAILABLE", hourlyRate: 120, description: "RTX 4070, 165Hz monitor", games: ["Valorant", "Dota 2"] },
    { resourceId: 7, resourceTypeId: 2, resourceName: "PC - Unit 3", brand: "Custom Build", maxPlayers: 1, status: "BOOKED", hourlyRate: 120, description: "RTX 4070, 165Hz monitor", games: ["CS2"], nextAvailableAt: "6:00 PM" },
  ],
  3: [
    { resourceId: 8, resourceTypeId: 3, resourceName: "VR - Unit 1", brand: "Meta Quest 3", maxPlayers: 1, status: "AVAILABLE", hourlyRate: 200, description: "Full room-scale setup", games: ["Beat Saber", "Half-Life: Alyx"] },
    { resourceId: 9, resourceTypeId: 3, resourceName: "VR - Unit 2", brand: "Meta Quest 3", maxPlayers: 1, status: "MAINTENANCE", hourlyRate: 200, description: "Full room-scale setup", games: ["Beat Saber"] },
  ],
  4: [
    { resourceId: 10, resourceTypeId: 4, resourceName: "Racing Sim - Rig 1", brand: "Logitech", maxPlayers: 1, status: "AVAILABLE", hourlyRate: 250, description: "Force feedback wheel, 3-screen setup" },
    { resourceId: 11, resourceTypeId: 4, resourceName: "Racing Sim - Rig 2", brand: "Logitech", maxPlayers: 1, status: "AVAILABLE", hourlyRate: 250, description: "Force feedback wheel, 3-screen setup" },
  ],
  5: [
    { resourceId: 12, resourceTypeId: 5, resourceName: "Pool Table 1", status: "AVAILABLE", hourlyRate: 120, description: "Standard 8ft table" },
    { resourceId: 13, resourceTypeId: 5, resourceName: "Pool Table 2", status: "BOOKED", hourlyRate: 120, description: "Standard 8ft table", nextAvailableAt: "5:15 PM" },
    { resourceId: 14, resourceTypeId: 5, resourceName: "Pool Table 3", status: "AVAILABLE", hourlyRate: 120, description: "Standard 8ft table" },
  ],
  6: [
    { resourceId: 15, resourceTypeId: 6, resourceName: "Snooker Table 1", status: "AVAILABLE", hourlyRate: 150, description: "Full-size 12ft table" },
  ],
  7: [
    { resourceId: 16, resourceTypeId: 7, resourceName: "Private Room A", brand: "Sony", maxPlayers: 4, status: "AVAILABLE", hourlyRate: 350, description: "Soundproofed room, 65\" TV, 2 controllers", games: ["FIFA 24", "GTA V"] },
  ],
};

export default function ResourceSelectionPage() {
  const { resourceTypeId } = useParams();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const typeId = Number(resourceTypeId) || 1;
  const currentResourceType =
    MOCK_ALL_TYPES.find((rt) => rt.resourceTypeId === typeId) ?? MOCK_ALL_TYPES[0];
  const units = MOCK_UNITS_BY_TYPE[typeId] ?? [];

  const allGames = Array.from(new Set(units.flatMap((u) => u.games ?? [])));

  const filteredUnits = selectedGame
    ? units.filter((u) => u.games?.includes(selectedGame))
    : units;

  return (
    <PageShell>
      <Header />

      <ResourceBreadcrumb
        cafeName="Respawn Lounge"
        currentResourceType={currentResourceType}
        allResourceTypes={MOCK_ALL_TYPES}
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

      <Footer cafeName="Respawn Lounge" locationLabel="Bhopal" />
    </PageShell>
  );
}
