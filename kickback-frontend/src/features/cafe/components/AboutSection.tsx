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
    <section className="px-4 py-4">
      <h2 className="text-xs uppercase tracking-wide text-text-secondary mb-2.5">
        About
      </h2>

      {cafe.description && (
        <p className="text-[13px] text-text-secondary leading-relaxed mb-3">
          {cafe.description}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {cafe.phone && (
          <a
            href={`tel:${cafe.phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-2 text-[13px] text-text-primary"
          >
            <IconBadge>
              <Phone size={12} />
            </IconBadge>
            {cafe.phone}
          </a>
        )}

        {cafe.email && (
          <a
            href={`mailto:${cafe.email}`}
            className="flex items-center gap-2 text-[13px] text-text-primary"
          >
            <IconBadge>
              <Mail size={12} />
            </IconBadge>
            {cafe.email}
          </a>
        )}

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[13px] text-text-primary"
        >
          <IconBadge>
            <MapPin size={12} />
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
    <span className="w-7 h-7 rounded-lg bg-bg-raised flex items-center justify-center text-text-secondary flex-shrink-0">
      {children}
    </span>
  );
}
