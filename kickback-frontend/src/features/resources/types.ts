// src/features/resources/types.ts

export type ResourceStatus = "AVAILABLE" | "BOOKED" | "MAINTENANCE" | "OUT_OF_SERVICE";

// Games are objects, not plain strings — the backend's CreateBookingRequest
// takes a gameId (Long), so we have to carry the ID through the whole
// selection flow, not just the display name.
export interface GameOption {
  gameId: number;
  gameName: string;
  thumbnailUrl?: string;
  minPlayers?: number;
  maxPlayers?: number;
}

export interface ResourceUnit {
  resourceId: number;
  resourceTypeId: number;
  resourceName: string;
  brand?: string;
  maxPlayers?: number;
  status: ResourceStatus;
  hourlyRate: number;
  description?: string; // free-text "specs" for MVP — see design notes
  games?: GameOption[]; // resolved from RESOURCE_GAMES join
  imageUrl?: string;
  nextAvailableAt?: string; // display-formatted time, only set when status !== AVAILABLE and known
}
