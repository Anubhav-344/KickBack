// src/features/cafe/pages/CafeLandingPage.tsx
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CafeHero from "../components/CafeHero";
import CafeMetaRow from "../components/CafeMetaRow";
import OfferSlider from "../components/OfferSlider";
import ResourceTypeGrid from "@/features/resources/components/ResourceTypeGrid";
import AmenitiesSection from "../components/AmenitiesSection";
import AboutSection from "../components/AboutSection";
import BookFloatingButton from "../components/BookFloatingButton";
import type { Cafe } from "../types";

// TEMPORARY: stand-in for `useCafeDetails(cafeSlug)` (React Query hook wrapping
// GET /cafes/:slug) until the backend endpoint exists. Swap this out, keep
// everything below unchanged — that's the point of colocating data-fetching
// in a hook rather than inline in the page.
const MOCK_CAFE: Cafe = {
  cafeId: 1,
  slug: "respawn-lounge",
  name: "Respawn Lounge",
  description:
    "Respawn Lounge is Bhopal's premium gaming café — consoles, PCs, VR, and tabletop games in a chill, air-conditioned space built for long sessions with friends.",
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
    {
      offerId: 1,
      title: "Weekday happy hour",
      promoCode: "HAPPY20",
      offerType: "PERCENTAGE_DISCOUNT",
      discountType: "PERCENTAGE",
      discountValue: 20,
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      isActive: true,
    },
    {
      offerId: 2,
      title: "Squad session",
      promoCode: "SQUAD100",
      offerType: "FLAT_DISCOUNT",
      discountType: "FIXED",
      discountValue: 100,
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      isActive: true,
    },
    {
      offerId: 3,
      title: "First timer bonus",
      promoCode: "NEWHERE",
      offerType: "EXTRA_TIME",
      bonusMinutes: 15,
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      isActive: true,
    },
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
};

export default function CafeLandingPage() {
  const cafe = MOCK_CAFE; // later: const { data: cafe, isLoading } = useCafeDetails(cafeSlug)

  const locationLabel = `${cafe.address.city}`;

  return (
    <PageShell>
      <Header />
      <CafeHero images={cafe.images} />
      <CafeMetaRow
        name={cafe.name}
        isOpenNow={cafe.isOpenNow}
        locationLabel={locationLabel}
        averageRating={cafe.averageRating}
        totalReviews={cafe.totalReviews}
      />
      <OfferSlider offers={cafe.offers} />
      <ResourceTypeGrid resourceTypes={cafe.resourceTypes} />
      <AmenitiesSection amenities={cafe.amenities} />
      <AboutSection cafe={cafe} />
      <Footer cafeName={cafe.name} locationLabel={locationLabel} />

      <BookFloatingButton resourceTypes={cafe.resourceTypes} />
    </PageShell>
  );
}
