// src/features/resources/types.ts

export type ResourceStatus = "AVAILABLE" | "BOOKED" | "MAINTENANCE" | "OUT_OF_SERVICE";

export interface ResourceUnit {
  resourceId: number;
  resourceTypeId: number;
  resourceName: string;
  brand?: string;
  maxPlayers?: number;
  status: ResourceStatus;
  hourlyRate: number;
  description?: string; // free-text "specs" for MVP — see design notes
  games?: string[]; // resolved from RESOURCE_GAMES join
  imageUrl?: string;
  nextAvailableAt?: string; // display-formatted time, e.g. "4:30 PM" — only set when status !== AVAILABLE and known
}
