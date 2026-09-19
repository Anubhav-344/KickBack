// src/features/cafe/api.ts
import axiosClient from "@/app/axiosClient";
import type { Cafe, CafeListing, Offer } from "./types";
import type { OperatingWindow } from "@/features/booking/types";

// --- Raw backend DTO shapes (what Spring/Jackson actually sends) ---
//
// These intentionally mirror the Java DTOs exactly, quirks included, and are
// converted to our clean frontend types by the mappers below. Keeping the
// raw shapes separate means backend naming changes only touch this file.

interface RawOperatingWindow {
  openingMinutes: number;
  closingMinutes: number;
  // Lombok generates isClosedToday() for `private boolean isClosedToday`,
  // and Jackson strips the "is" prefix — so the wire format is actually
  // `closedToday`. Accepting BOTH keys means this keeps working whether or
  // not the backend adds @JsonProperty("isClosedToday") later.
  isClosedToday?: boolean;
  closedToday?: boolean;
}

interface RawOffer {
  offerId: number;
  title: string;
  promoCode?: string;
  description?: string;
  offerType: Offer["offerType"];
  discountType?: Offer["discountType"];
  discountValue?: number;
  bonusMinutes?: number;
  validFrom: string;
  validTo: string;
  // Same Jackson quirk: `private boolean active` serializes as `active`,
  // but accept `isActive` too in case the field is renamed.
  active?: boolean;
  isActive?: boolean;
}

interface RawCafeListing {
  cafeId: number;
  slug: string;
  name: string;
  area: string;
  city: string;
  averageRating: number;
  totalReviews: number;
  startingHourlyRate: number;
  resourceTypeTags: string[];
  imageUrl?: string;
  todayOperatingWindow: RawOperatingWindow;
}

interface RawCafeDetails {
  cafeId: number;
  slug: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  averageRating: number;
  totalReviews: number;
  openNow?: boolean;
  isOpenNow?: boolean;
  images: string[];
  address: Cafe["address"];
  amenities: Cafe["amenities"];
  offers: RawOffer[];
  resourceTypes: Cafe["resourceTypes"];
  // NOTE: CafeDetailsResponse calls this `operatingWindow`, while
  // CafeListingResponse calls the same thing `todayOperatingWindow`.
  // Normalizing both to `operatingWindowToday` on our side.
  operatingWindow: RawOperatingWindow;
}

// --- Mappers ---

export function mapOperatingWindow(raw: RawOperatingWindow): OperatingWindow {
  return {
    openingMinutes: raw.openingMinutes,
    closingMinutes: raw.closingMinutes,
    isClosedToday: raw.isClosedToday ?? raw.closedToday ?? false,
  };
}

function mapOffer(raw: RawOffer): Offer {
  return {
    offerId: raw.offerId,
    title: raw.title,
    promoCode: raw.promoCode,
    description: raw.description,
    offerType: raw.offerType,
    discountType: raw.discountType,
    discountValue: raw.discountValue,
    bonusMinutes: raw.bonusMinutes,
    validFrom: raw.validFrom,
    validTo: raw.validTo,
    isActive: raw.isActive ?? raw.active ?? true,
  };
}

function mapCafeListing(raw: RawCafeListing): CafeListing {
  return {
    cafeId: raw.cafeId,
    slug: raw.slug,
    name: raw.name,
    area: raw.area,
    city: raw.city,
    averageRating: raw.averageRating ?? 0,
    totalReviews: raw.totalReviews ?? 0,
    startingHourlyRate: raw.startingHourlyRate ?? 0,
    resourceTypeTags: raw.resourceTypeTags ?? [],
    imageUrl: raw.imageUrl,
    todayOperatingWindow: mapOperatingWindow(raw.todayOperatingWindow),
  };
}

function mapCafeDetails(raw: RawCafeDetails): Cafe {
  return {
    cafeId: raw.cafeId,
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    email: raw.email,
    phone: raw.phone,
    averageRating: raw.averageRating ?? 0,
    totalReviews: raw.totalReviews ?? 0,
    isOpenNow: raw.isOpenNow ?? raw.openNow ?? false,
    images: raw.images ?? [],
    address: raw.address,
    amenities: raw.amenities ?? [],
    offers: (raw.offers ?? []).map(mapOffer),
    resourceTypes: raw.resourceTypes ?? [],
    operatingWindowToday: mapOperatingWindow(raw.operatingWindow),
  };
}

// --- Calls ---

export const cafeApi = {
  listCafes: (city?: string) =>
    axiosClient
      .get<RawCafeListing[]>("/cafes", { params: city ? { city } : undefined })
      .then((res) => res.data.map(mapCafeListing)),

  getCafeBySlug: (slug: string) =>
    axiosClient.get<RawCafeDetails>(`/cafes/${slug}`).then((res) => mapCafeDetails(res.data)),
};
