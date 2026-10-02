// src/features/auth/pages/SupportPage.tsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// STUB — real version: FAQ, contact form, or a support-ticket link.
export default function SupportPage() {
  const navigate = useNavigate();

  return (
    <PageShell>
      <Header />
      <div className="px-4 py-6">
        <div className="flex items-center gap-2.5 mb-4">
          <button onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={18} className="text-text-secondary" />
          </button>
          <h1 className="font-display font-semibold text-2xl text-text-primary">
            Help &amp; Support
          </h1>
        </div>
        <p className="text-sm text-text-secondary">
          Reach us at hello@respawnlounge.in or call +91 98765 43210.
        </p>
      </div>
      <Footer cafeName="Respawn Lounge" locationLabel="Bhopal" />
    </PageShell>
  );
}
