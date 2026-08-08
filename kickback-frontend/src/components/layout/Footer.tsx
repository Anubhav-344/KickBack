// src/components/layout/Footer.tsx

interface FooterProps {
  cafeName: string;
  locationLabel: string;
}

// mt-auto pins this to the bottom of PageShell's flex column when content
// is short; it flows naturally right after content when content is long.
export default function Footer({ cafeName, locationLabel }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-border-subtle px-4 py-6 text-center text-[11px] text-text-secondary">
      KickBack &middot; {cafeName}, {locationLabel}
    </footer>
  );
}
