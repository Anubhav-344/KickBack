// src/features/auth/pages/SupportPage.tsx
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// STUB — real version: FAQ, contact form, or a support-ticket link.
export default function SupportPage() {
  return (
    <PageShell>
      <Header />
      <div className="px-4 py-6">
        <h1 className="font-display font-semibold text-2xl text-text-primary mb-4">
          Help & Support
        </h1>
        <p className="text-sm text-text-secondary">
          Reach us at hello@respawnlounge.in or call +91 98765 43210.
        </p>
      </div>
      <Footer cafeName="Respawn Lounge" locationLabel="Bhopal" />
    </PageShell>
  );
}
