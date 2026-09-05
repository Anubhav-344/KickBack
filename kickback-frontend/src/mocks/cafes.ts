// src/mocks/cafes.ts
//
// Single shared mock "database" for all café-related data across the app.
// Every page reads from here instead of hardcoding its own MOCK_X constant.
// This is the seam that gets swapped for real API calls in Phase 4 —
// consolidating it now means that swap touches this file's internals per
// entity type, not every page individually.

import type { Cafe, ResourceTypeSummary, CafeListing } from "@/features/cafe/types";
import type { ResourceUnit } from "@/features/resources/types";
import type { ExistingBooking, OperatingWindow } from "@/features/booking/types";

interface MockCafeRecord extends Cafe {
  operatingWindowToday: OperatingWindow;
}

const RESPAWN_LOUNGE: MockCafeRecord = {
  cafeId: 1,
  slug: "respawn-lounge",
  name: "Respawn Lounge",
  description:
    "Respawn Lounge is Bhopal's premium gaming caf\u00E9 \u2014 consoles, PCs, VR, and tabletop games in a chill, air-conditioned space built for long sessions with friends.",
  email: "hello@respawnlounge.in",
  phone: "+91 98765 43210",
  averageRating: 4.6,
  totalReviews: 128,
  isOpenNow: true,
  images: [],
  address: {
    addressLine1: "MP Nagar Zone 2",
    city: "Bhopal",
    state: "Madhya Pradesh",
    country: "India",
    pincode: "462011",
  },
  amenities: [
    { amenityId: 1, amenityName: "Wi-Fi", iconName: "wifi" },
    { amenityId: 2, amenityName: "Snacks", iconName: "snacks" },
    { amenityId: 3, amenityName: "AC", iconName: "ac" },
    { amenityId: 4, amenityName: "Parking", iconName: "parking" },
  ],
  offers: [
    { offerId: 1, title: "Weekday happy hour", promoCode: "HAPPY20", offerType: "PERCENTAGE_DISCOUNT", discountType: "PERCENTAGE", discountValue: 20, validFrom: "2026-01-01", validTo: "2026-12-31", isActive: true },
    { offerId: 2, title: "Squad session", promoCode: "SQUAD100", offerType: "FLAT_DISCOUNT", discountType: "FIXED", discountValue: 100, validFrom: "2026-01-01", validTo: "2026-12-31", isActive: true },
    { offerId: 3, title: "First timer bonus", promoCode: "NEWHERE", offerType: "EXTRA_TIME", bonusMinutes: 15, validFrom: "2026-01-01", validTo: "2026-12-31", isActive: true },
  ],
  resourceTypes: [
    { resourceTypeId: 1, resourceName: "PS5", totalUnits: 4, startingHourlyRate: 150, supportsGames: true },
    { resourceTypeId: 2, resourceName: "PC", totalUnits: 6, startingHourlyRate: 120, supportsGames: true },
    { resourceTypeId: 3, resourceName: "VR", totalUnits: 2, startingHourlyRate: 200, supportsGames: true },
    { resourceTypeId: 4, resourceName: "Racing Sim", totalUnits: 2, startingHourlyRate: 250, supportsGames: true },
    { resourceTypeId: 5, resourceName: "8 Ball Pool", totalUnits: 3, startingHourlyRate: 120, supportsGames: false },
    { resourceTypeId: 6, resourceName: "Snooker", totalUnits: 1, startingHourlyRate: 150, supportsGames: false },
    { resourceTypeId: 7, resourceName: "Private Room (PS5)", totalUnits: 1, startingHourlyRate: 350, supportsGames: true },
  ],
  operatingWindowToday: { openingMinutes: 10 * 60, closingMinutes: 23 * 60, isClosedToday: false },
};

const PIXEL_ARENA: MockCafeRecord = {
  cafeId: 2,
  slug: "pixel-arena",
  name: "Pixel Arena",
  description:
    "Pixel Arena is Arera Colony's go-to spot for competitive PC gaming and racing sim rigs, tuned for serious sessions.",
  email: "play@pixelarena.in",
  phone: "+91 91234 56780",
  averageRating: 4.3,
  totalReviews: 64,
  isOpenNow: true,
  images: [],
  address: {
    addressLine1: "E-8 Arera Colony",
    city: "Bhopal",
    state: "Madhya Pradesh",
    country: "India",
    pincode: "462016",
  },
  amenities: [
    { amenityId: 1, amenityName: "Wi-Fi", iconName: "wifi" },
    { amenityId: 3, amenityName: "AC", iconName: "ac" },
  ],
  offers: [
    { offerId: 10, title: "Weekend grind", promoCode: "GRIND10", offerType: "PERCENTAGE_DISCOUNT", discountType: "PERCENTAGE", discountValue: 10, validFrom: "2026-01-01", validTo: "2026-12-31", isActive: true },
  ],
  resourceTypes: [
    { resourceTypeId: 101, resourceName: "PC", totalUnits: 8, startingHourlyRate: 100, supportsGames: true },
    { resourceTypeId: 102, resourceName: "Racing Sim", totalUnits: 2, startingHourlyRate: 220, supportsGames: true },
  ],
  operatingWindowToday: { openingMinutes: 11 * 60, closingMinutes: 22 * 60, isClosedToday: false },
};

const GG_GAMING_HUB: MockCafeRecord = {
  cafeId: 3,
  slug: "gg-gaming-hub",
  name: "GG Gaming Hub",
  description: "A cozy neighbourhood spot on Kolar Road for PS5 sessions and snooker.",
  email: "contact@gggaminghub.in",
  phone: "+91 90000 11122",
  averageRating: 4.1,
  totalReviews: 41,
  isOpenNow: false,
  images: [],
  address: {
    addressLine1: "Kolar Road",
    city: "Bhopal",
    state: "Madhya Pradesh",
    country: "India",
    pincode: "462042",
  },
  amenities: [{ amenityId: 1, amenityName: "Wi-Fi", iconName: "wifi" }],
  offers: [],
  resourceTypes: [
    { resourceTypeId: 201, resourceName: "PS5", totalUnits: 3, startingHourlyRate: 130, supportsGames: true },
    { resourceTypeId: 202, resourceName: "Snooker", totalUnits: 1, startingHourlyRate: 140, supportsGames: false },
  ],
  // Opens later today — proves the "Opens at X" label works, not just closed/open
  operatingWindowToday: { openingMinutes: 17 * 60, closingMinutes: 24 * 60, isClosedToday: false },
};

const LEVEL_UP_CAFE: MockCafeRecord = {
  cafeId: 4,
  slug: "level-up-cafe",
  name: "Level Up Caf\u00E9",
  description: "New Market's newest gaming lounge, featuring PS5, PC, and VR stations.",
  email: "hello@levelupcafe.in",
  phone: "+91 90909 80808",
  averageRating: 4.4,
  totalReviews: 89,
  isOpenNow: false,
  images: [],
  address: {
    addressLine1: "New Market",
    city: "Bhopal",
    state: "Madhya Pradesh",
    country: "India",
    pincode: "462003",
  },
  amenities: [
    { amenityId: 1, amenityName: "Wi-Fi", iconName: "wifi" },
    { amenityId: 2, amenityName: "Snacks", iconName: "snacks" },
  ],
  offers: [],
  resourceTypes: [
    { resourceTypeId: 301, resourceName: "PS5", totalUnits: 2, startingHourlyRate: 140, supportsGames: true },
    { resourceTypeId: 302, resourceName: "PC", totalUnits: 3, startingHourlyRate: 110, supportsGames: true },
    { resourceTypeId: 303, resourceName: "VR", totalUnits: 1, startingHourlyRate: 210, supportsGames: true },
  ],
  // Closed all day today — proves the "Closed today" label + bottom-sort work
  operatingWindowToday: { openingMinutes: 0, closingMinutes: 0, isClosedToday: true },
};

const CAFES_BY_SLUG: Record<string, MockCafeRecord> = {
  [RESPAWN_LOUNGE.slug]: RESPAWN_LOUNGE,
  [PIXEL_ARENA.slug]: PIXEL_ARENA,
  [GG_GAMING_HUB.slug]: GG_GAMING_HUB,
  [LEVEL_UP_CAFE.slug]: LEVEL_UP_CAFE,
};

export function getCafeBySlug(slug: string): MockCafeRecord | undefined {
  return CAFES_BY_SLUG[slug];
}

export function getAllCafes(): MockCafeRecord[] {
  return Object.values(CAFES_BY_SLUG);
}

export function toCafeListing(cafe: MockCafeRecord): CafeListing {
  return {
    cafeId: cafe.cafeId,
    slug: cafe.slug,
    name: cafe.name,
    area: cafe.address.addressLine1,
    city: cafe.address.city,
    averageRating: cafe.averageRating,
    totalReviews: cafe.totalReviews,
    startingHourlyRate: Math.min(...cafe.resourceTypes.map((rt) => rt.startingHourlyRate)),
    resourceTypeTags: cafe.resourceTypes.map((rt) => rt.resourceName),
    todayOperatingWindow: cafe.operatingWindowToday,
  };
}

export function getResourceTypeById(
  cafeSlug: string,
  resourceTypeId: number
): ResourceTypeSummary | undefined {
  return getCafeBySlug(cafeSlug)?.resourceTypes.find((rt) => rt.resourceTypeId === resourceTypeId);
}

// --- Resource units, keyed by café slug -> resourceTypeId ---

const UNITS_BY_CAFE: Record<string, Record<number, ResourceUnit[]>> = {
  "respawn-lounge": {
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
      { resourceId: 16, resourceTypeId: 7, resourceName: "Private Room A", brand: "Sony", maxPlayers: 4, status: "AVAILABLE", hourlyRate: 350, description: 'Soundproofed room, 65" TV, 2 controllers', games: ["FIFA 24", "GTA V"] },
    ],
  },
  "pixel-arena": {
    101: [
      { resourceId: 201, resourceTypeId: 101, resourceName: "PC - Rig 1", brand: "Custom Build", maxPlayers: 1, status: "AVAILABLE", hourlyRate: 100, description: "RTX 4060, 144Hz monitor", games: ["Valorant", "CS2", "Apex Legends"] },
      { resourceId: 202, resourceTypeId: 101, resourceName: "PC - Rig 2", brand: "Custom Build", maxPlayers: 1, status: "AVAILABLE", hourlyRate: 100, description: "RTX 4060, 144Hz monitor", games: ["Valorant", "Apex Legends"] },
      { resourceId: 203, resourceTypeId: 101, resourceName: "PC - Rig 3", brand: "Custom Build", maxPlayers: 1, status: "BOOKED", hourlyRate: 100, description: "RTX 4060, 144Hz monitor", games: ["CS2"], nextAvailableAt: "3:00 PM" },
    ],
    102: [
      { resourceId: 204, resourceTypeId: 102, resourceName: "Racing Sim - Rig 1", brand: "Fanatec", maxPlayers: 1, status: "AVAILABLE", hourlyRate: 220, description: "Direct-drive wheel, triple-screen" },
      { resourceId: 205, resourceTypeId: 102, resourceName: "Racing Sim - Rig 2", brand: "Fanatec", maxPlayers: 1, status: "AVAILABLE", hourlyRate: 220, description: "Direct-drive wheel, triple-screen" },
    ],
  },
  "gg-gaming-hub": {
    201: [
      { resourceId: 301, resourceTypeId: 201, resourceName: "PS5 - Unit 1", brand: "Sony", maxPlayers: 4, status: "AVAILABLE", hourlyRate: 130, description: '43" TV, 2 controllers', games: ["FIFA 24"] },
      { resourceId: 302, resourceTypeId: 201, resourceName: "PS5 - Unit 2", brand: "Sony", maxPlayers: 4, status: "AVAILABLE", hourlyRate: 130, description: '43" TV, 2 controllers', games: ["FIFA 24", "GTA V"] },
    ],
    202: [
      { resourceId: 303, resourceTypeId: 202, resourceName: "Snooker Table 1", status: "AVAILABLE", hourlyRate: 140, description: "Full-size 12ft table" },
    ],
  },
  "level-up-cafe": {
    301: [
      { resourceId: 401, resourceTypeId: 301, resourceName: "PS5 - Unit 1", brand: "Sony", maxPlayers: 4, status: "AVAILABLE", hourlyRate: 140, description: '50" TV, 2 controllers', games: ["FIFA 24", "GTA V"] },
    ],
    302: [
      { resourceId: 402, resourceTypeId: 302, resourceName: "PC - Unit 1", brand: "Custom Build", maxPlayers: 1, status: "AVAILABLE", hourlyRate: 110, description: "RTX 4060", games: ["Valorant"] },
    ],
    303: [
      { resourceId: 403, resourceTypeId: 303, resourceName: "VR - Unit 1", brand: "Meta Quest 3", maxPlayers: 1, status: "AVAILABLE", hourlyRate: 210, description: "Room-scale setup", games: ["Beat Saber"] },
    ],
  },
};

export function getUnitsByResourceType(cafeSlug: string, resourceTypeId: number): ResourceUnit[] {
  return UNITS_BY_CAFE[cafeSlug]?.[resourceTypeId] ?? [];
}

export function getUnitById(resourceId: number): ResourceUnit | undefined {
  for (const cafeUnits of Object.values(UNITS_BY_CAFE)) {
    for (const units of Object.values(cafeUnits)) {
      const found = units.find((u) => u.resourceId === resourceId);
      if (found) return found;
    }
  }
  return undefined;
}

// Finds which café a given resourceId belongs to — needed on the Booking
// page, which only has :resourceId in its URL, not :cafeSlug.
export function getCafeSlugByResourceId(resourceId: number): string | undefined {
  for (const [slug, cafeUnits] of Object.entries(UNITS_BY_CAFE)) {
    for (const units of Object.values(cafeUnits)) {
      if (units.some((u) => u.resourceId === resourceId)) return slug;
    }
  }
  return undefined;
}

// --- Existing bookings, keyed by resourceId — feeds the availability timeline ---

const BOOKINGS_BY_RESOURCE: Record<number, ExistingBooking[]> = {
  1: [
    { startMinutes: 12 * 60, endMinutes: 13 * 60 },
    { startMinutes: 19 * 60, endMinutes: 20 * 60 },
  ],
  201: [{ startMinutes: 13 * 60, endMinutes: 15 * 60 }],
};

export function getBookingsForResource(resourceId: number): ExistingBooking[] {
  return BOOKINGS_BY_RESOURCE[resourceId] ?? [];
}
