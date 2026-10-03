// src/features/auth/pages/SupportPage.tsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import AuthSidePanel from "@/components/layout/AuthSidePanel";

// STUB — these are placeholder contact details, carried over from the
// original page. Real version: FAQ, a contact form, or a ticket link.
const SUPPORT_EMAIL = "hello@respawnlounge.in";
const SUPPORT_PHONE_DISPLAY = "+91 98765 43210";
const SUPPORT_PHONE_HREF = "+919876543210";

// Same two-column layout as Login / Signup / Profile (content left, branded
// panel right on desktop). No footer: this page isn't tied to any one café,
// and the old footer here claimed "Respawn Lounge, Bhopal" regardless.
export default function SupportPage() {
  const navigate = useNavigate();

  return (
    <PageShell>
      <Header />

      <div className="flex-1 flex">
      <div className="flex-1 lg:w-1/2 px-4 lg:px-16 py-6 lg:py-8 w-full">
      <div className="max-w-md mx-auto w-full">
        <div className="flex items-center gap-2.5 mb-6">
          <button onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={18} className="text-text-secondary" />
          </button>
          <h1 className="font-display font-semibold text-2xl lg:text-3xl text-text-primary">
            Help &amp; Support
          </h1>
        </div>

        <p className="text-sm lg:text-base text-text-secondary mb-6">
          Having trouble with a booking or a payment? Get in touch:
        </p>

        <div className="flex flex-col gap-3">
          <ContactRow
            href={`mailto:${SUPPORT_EMAIL}`}
            icon={<Mail size={16} />}
            label="Email"
            value={SUPPORT_EMAIL}
          />
          <ContactRow
            href={`tel:${SUPPORT_PHONE_HREF}`}
            icon={<Phone size={16} />}
            label="Phone"
            value={SUPPORT_PHONE_DISPLAY}
          />
        </div>
      </div>
      </div>
      <AuthSidePanel className="hidden lg:flex lg:w-1/2" />
      </div>
    </PageShell>
  );
}

function ContactRow({
  href,
  icon,
  label,
  value,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3.5 bg-bg-surface border border-border-subtle rounded-card px-4 py-3.5 hover:border-accent/40 transition"
    >
      <span className="w-9 h-9 rounded-lg bg-bg-raised flex items-center justify-center text-text-secondary flex-shrink-0">
        {icon}
      </span>
      <span>
        <span className="block text-xs text-text-secondary">{label}</span>
        <span className="block text-sm lg:text-base font-medium text-text-primary">
          {value}
        </span>
      </span>
    </a>
  );
}
