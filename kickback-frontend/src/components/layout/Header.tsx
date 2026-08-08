// src/components/layout/Header.tsx

// Identical on every page — logo, brand, avatar stack. No back button here;
// back navigation lives inline next to the café name on drill-down pages
// (see ResourceBreadcrumb), so the header itself never has to vary.
export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
      <div className="flex items-center">
        <div className="w-6 h-6 rounded-md bg-accent" />
        <span className="ml-2.5 font-display font-bold text-lg text-text-primary">
          KickBack
        </span>
      </div>
      {/* Decorative for now — becomes real "recent members" data later */}
      <div className="flex">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full border-2 border-bg-base bg-gradient-to-br from-bg-raised to-bg-surface -ml-2 first:ml-0"
          />
        ))}
      </div>
    </header>
  );
}
