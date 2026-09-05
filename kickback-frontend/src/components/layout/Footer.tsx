// src/components/layout/Footer.tsx

interface FooterProps {
  cafeName?: string;
  locationLabel?: string;
}

// mt-auto pins this to the bottom of PageShell's flex column when content
// is short. Props are optional — pages scoped to one café pass both;
// multi-café pages (like discovery) omit them and get a generic line.
export default function Footer({ cafeName, locationLabel }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-border-subtle px-4 py-6 text-center text-[11px] text-text-secondary">
      {cafeName && locationLabel
        ? `KickBack \u00B7 ${cafeName}, ${locationLabel}`
        : "KickBack \u00B7 Discover caf\u00E9s in Bhopal"}
    </footer>
  );
}
