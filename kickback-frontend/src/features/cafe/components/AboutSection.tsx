// src/features/cafe/components/AboutSection.tsx
import { Phone, Mail, MapPin } from "lucide-react";
import type { Cafe } from "../types";

interface AboutSectionProps {
  cafe: Cafe;
}

export default function AboutSection({ cafe }: AboutSectionProps) {
  const locationText = `${cafe.address.city}, ${cafe.address.state}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${cafe.name} ${cafe.address.addressLine1} ${locationText}`
  )}`;

  return (
    <section className="px-4 lg:px-8 py-4">
      <h2 className="text-xs lg:text-sm uppercase tracking-wide text-text-secondary mb-2.5 lg:mb-3.5">
        About
      </h2>

      {cafe.description && (
        <p className="text-[13px] lg:text-base text-text-secondary leading-relaxed mb-3 lg:mb-4">
          {cafe.description}
        </p>
      )}

      <div className="flex flex-col gap-2 lg:gap-2.5">
        {cafe.phone && (
          <a
            href={`tel:${cafe.phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-2 text-[13px] lg:text-base text-text-primary"
          >
            <IconBadge>
              <Phone size={12} className="lg:w-[14px] lg:h-[14px]" />
            </IconBadge>
            {cafe.phone}
          </a>
        )}

        {cafe.email && (
          <a
            href={`mailto:${cafe.email}`}
            className="flex items-center gap-2 text-[13px] lg:text-base text-text-primary"
          >
            <IconBadge>
              <Mail size={12} className="lg:w-[14px] lg:h-[14px]" />
            </IconBadge>
            {cafe.email}
          </a>
        )}

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[13px] lg:text-base text-text-primary"
        >
          <IconBadge>
            <MapPin size={12} className="lg:w-[14px] lg:h-[14px]" />
          </IconBadge>
          <span className="text-accent-hover underline">
            {cafe.address.addressLine1}, {locationText} &mdash; Get directions
          </span>
        </a>
      </div>
    </section>
  );
}

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-7 h-7 lg:w-9 lg:h-9 rounded-lg bg-bg-raised flex items-center justify-center text-text-secondary flex-shrink-0">
      {children}
    </span>
  );
}
