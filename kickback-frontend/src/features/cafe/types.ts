// src/features/cafe/types.ts

export interface CafeAddress {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  }
  
  export interface Amenity {
    amenityId: number;
    amenityName: string;
    iconName: string; // matches AMENITIES.icon_name — used as a lookup key, not rendered directly
  }
  
  export interface Offer {
    offerId: number;
    title: string;
    promoCode?: string;
    description?: string;
    offerType: "PERCENTAGE_DISCOUNT" | "FLAT_DISCOUNT" | "EXTRA_TIME";
    discountType?: "PERCENTAGE" | "FIXED";
    discountValue?: number;
    bonusMinutes?: number;
    validFrom: string;
    validTo: string;
    isActive: boolean;
  }
  
  // Aggregate view of a resource type at this cafe — NOT individual units.
  // totalUnits is a plain count, deliberately not a live "available now" signal
  // (see design discussion: that distinction only matters once a time range is picked).
  export interface ResourceTypeSummary {
    resourceTypeId: number;
    resourceName: string;
    totalUnits: number;
    startingHourlyRate: number;
    supportsGames: boolean;
  }
  
  export interface Cafe {
    cafeId: number;
    slug: string;
    name: string;
    description?: string;
    email?: string;
    phone?: string;
    averageRating: number;
    totalReviews: number;
    isOpenNow: boolean;
    images: string[];
    address: CafeAddress;
    amenities: Amenity[];
    offers: Offer[];
    resourceTypes: ResourceTypeSummary[];
  }
  