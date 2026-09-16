import axiosClient from "@/app/axiosClient";
import type { Cafe, CafeListing, CafeAddress, Amenity, Offer } from "./types";

interface BackendOperatingWindow {
  openingMinutes: number;
  closingMinutes: number;
  closedToday?: boolean;
  isClosedToday?: boolean;
}

interface BackendCafeListing {
  cafeId: number;
  slug: string;
  name: string;
  area: string;
  city: string;
  averageRating: number | string;
  totalReviews: number;
  startingHourlyRate: number | string;
  resourceTypeTags: string[];
  imageUrl?: string;
  todayOperatingWindow: BackendOperatingWindow;
}

interface BackendCafeDetails {
  cafeId: number;
  slug: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  averageRating: number | string;
  totalReviews: number;
  openNow: boolean;
  operatingWindowToday: BackendOperatingWindow;
  images?: string[];
  address: CafeAddress;
  amenities?: Amenity[];
  offers?: Array<{
    offerId: number;
    title: string;
    promoCode?: string;
    description?: string;
    offerType: Offer["offerType"];
    discountType?: Offer["discountType"];
    discountValue?: number | string;
    bonusMinutes?: number;
    validFrom: string;
    validTo: string;
    active: boolean;
    isActive?: boolean;
  }>;
  resourceTypes?: Array<{
    resourceTypeId: number;
    resourceName: string;
    totalUnits: number;
    startingHourlyRate: number | string;
    supportsGames: boolean;
  }>;
}

function toNumber(value: number | string | undefined): number {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function mapOperatingWindow(window: BackendOperatingWindow) {
  return {
    openingMinutes: window.openingMinutes,
    closingMinutes: window.closingMinutes,
    isClosedToday: window.isClosedToday ?? window.closedToday ?? false,
  };
}

function mapListing(cafe: BackendCafeListing): CafeListing {
  return {
    cafeId: cafe.cafeId,
    slug: cafe.slug,
    name: cafe.name,
    area: cafe.area,
    city: cafe.city,
    averageRating: toNumber(cafe.averageRating),
    totalReviews: cafe.totalReviews,
    startingHourlyRate: toNumber(cafe.startingHourlyRate),
    resourceTypeTags: cafe.resourceTypeTags ?? [],
    imageUrl: cafe.imageUrl,
    todayOperatingWindow: mapOperatingWindow(cafe.todayOperatingWindow),
  };
}

function mapDetails(cafe: BackendCafeDetails): Cafe {
  return {
    cafeId: cafe.cafeId,
    slug: cafe.slug,
    name: cafe.name,
    description: cafe.description,
    email: cafe.email,
    phone: cafe.phone,
    averageRating: toNumber(cafe.averageRating),
    totalReviews: cafe.totalReviews,
    isOpenNow: cafe.openNow,
    operatingWindowToday: mapOperatingWindow(cafe.operatingWindowToday),
    images: cafe.images ?? [],
    address: cafe.address,
    amenities: cafe.amenities ?? [],
    offers: (cafe.offers ?? []).map((offer) => ({
      ...offer,
      discountValue: offer.discountValue === undefined ? undefined : toNumber(offer.discountValue),
      isActive: offer.isActive ?? offer.active,
    })),
    resourceTypes: (cafe.resourceTypes ?? []).map((resourceType) => ({
      ...resourceType,
      startingHourlyRate: toNumber(resourceType.startingHourlyRate),
    })),
  };
}

export async function getCafes(city?: string): Promise<CafeListing[]> {
  const response = await axiosClient.get<BackendCafeListing[]>("/cafes", {
    params: city ? { city } : undefined,
  });
  return response.data.map(mapListing);
}

export async function getCafeDetails(slug: string): Promise<Cafe> {
  const response = await axiosClient.get<BackendCafeDetails>(`/cafes/${slug}`);
  return mapDetails(response.data);
}
