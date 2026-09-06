// src/features/cafe/pages/CafeLandingPage.tsx
import { useParams, Link } from "react-router-dom";
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
import { useCafeDetails } from "../hooks/useCafeDetails";
import { computeCafeOpenStatus } from "@/lib/cafeStatus";

export default function CafeLandingPage() {
  const { cafeSlug } = useParams();
  const { data: cafe, isLoading, isError } = useCafeDetails(cafeSlug);

  if (isLoading) {
    return (
      <PageShell>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-text-secondary">Loading caf&eacute;...</p>
        </div>
        <Footer />
      </PageShell>
    );
  }

  if (isError || !cafe) {
    return (
      <PageShell>
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display font-semibold text-xl text-text-primary mb-2">
            Caf&eacute; not found
          </h1>
          <p className="text-sm text-text-secondary mb-5">
            We couldn&apos;t find a caf&eacute; at this address.
          </p>
          <Link
            to="/"
            className="text-sm font-semibold text-accent-hover border border-accent/40 rounded-md px-4 py-2"
          >
            Back to Discovery
          </Link>
        </div>
        <Footer />
      </PageShell>
    );
  }

  const locationLabel = cafe.address.city;
  const { isOpenNow, label: statusLabel } = computeCafeOpenStatus(cafe.operatingWindowToday);

  return (
    <PageShell>
      <Header />
      <CafeHero images={cafe.images} />
      <CafeMetaRow
        name={cafe.name}
        isOpenNow={isOpenNow}
        statusLabel={statusLabel}
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
