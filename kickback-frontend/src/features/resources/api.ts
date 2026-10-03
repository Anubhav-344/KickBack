// src/features/resources/api.ts
import axiosClient from "@/app/axiosClient";
import { mapOperatingWindow } from "@/features/cafe/api";
import { formatDateLabel, formatMinutesAsTime, todayISO } from "@/lib/dateTime";
import type { ResourceUnit, GameOption, ResourceStatus } from "./types";
import type { ExistingBooking, OperatingWindow } from "@/features/booking/types";

// --- Raw backend DTO shapes ---

interface RawGame {
  gameId: number;
  gameName: string;
  thumbnailUrl?: string;
  multiplayer?: boolean;
  minPlayers?: number;
  maxPlayers?: number;
}

interface RawResource {
  resourceId: number;
  resourceTypeId: number;
  resourceName: string;
  brand?: string;
  maxPlayers?: number;
  status: ResourceStatus;
  hourlyRate: number;
  description?: string;
  games?: RawGame[];
  imageUrl?: string;
  // ISO LocalDateTime from the backend (e.g. "2026-10-03T15:00:00"), only
  // present when the unit is in use right now.
  nextAvailableAt?: string;
  extraNote?: string;
}

// GET /api/cafes/{slug}/resources returns a WRAPPED object, not a bare
// array — `resourceType` is null when no resourceTypeId filter is passed.
interface RawResourceList {
  resourceType: {
    resourceTypeId: number;
    resourceName: string;
    supportsGames?: boolean;
    resourceImageUrl?: string;
  } | null;
  resources: RawResource[];
}

interface RawAvailability {
  resourceId: number;
  date: string;
  operatingWindow: {
    openingMinutes: number;
    closingMinutes: number;
    isClosedToday?: boolean;
    closedToday?: boolean;
  };
  bookings: ExistingBooking[];
}

// --- Mappers ---

function mapGame(raw: RawGame): GameOption {
  return {
    gameId: raw.gameId,
    gameName: raw.gameName,
    thumbnailUrl: raw.thumbnailUrl,
    minPlayers: raw.minPlayers,
    maxPlayers: raw.maxPlayers,
  };
}

// The backend sends nextAvailableAt as an ISO timestamp; the card just
// prints whatever string it's given, so turn it into something readable:
// "3:00 PM" if it's today, "Tomorrow, 1:00 AM" (etc.) otherwise. If it's
// not a parseable date at all (e.g. already a display string), pass it
// through untouched.
function formatNextFree(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const time = formatMinutesAsTime(d.getHours() * 60 + d.getMinutes());
  const dateISO = iso.slice(0, 10);
  return dateISO === todayISO() ? time : `${formatDateLabel(dateISO)}, ${time}`;
}

function mapResource(raw: RawResource): ResourceUnit {
  return {
    resourceId: raw.resourceId,
    resourceTypeId: raw.resourceTypeId,
    resourceName: raw.resourceName,
    brand: raw.brand,
    maxPlayers: raw.maxPlayers,
    status: raw.status,
    hourlyRate: raw.hourlyRate,
    description: raw.description,
    games: (raw.games ?? []).map(mapGame),
    imageUrl: raw.imageUrl,
    nextAvailableAt: formatNextFree(raw.nextAvailableAt),
    extraNote: raw.extraNote ?? undefined,
  };
}

export interface AvailabilityData {
  operatingWindow: OperatingWindow;
  bookings: ExistingBooking[];
}

// --- Calls ---

export const resourceApi = {
  // Unwraps the {resourceType, resources} envelope down to just the units,
  // since that's all the resource-selection grid needs (the type itself
  // already comes from the café details response).
  listByType: (cafeSlug: string, resourceTypeId?: number) =>
    axiosClient
      .get<RawResourceList>(`/cafes/${cafeSlug}/resources`, {
        params: resourceTypeId ? { resourceTypeId } : undefined,
      })
      .then((res) => (res.data.resources ?? []).map(mapResource)),

  getById: (resourceId: number) =>
    axiosClient.get<RawResource>(`/resources/${resourceId}`).then((res) => mapResource(res.data)),

  // NOTE: no cafeSlug in this path — availability is keyed on resourceId alone.
  getAvailability: (resourceId: number, date: string): Promise<AvailabilityData> =>
    axiosClient
      .get<RawAvailability>(`/resources/${resourceId}/availability`, { params: { date } })
      .then((res) => ({
        operatingWindow: mapOperatingWindow(res.data.operatingWindow),
        bookings: res.data.bookings ?? [],
      })),
};