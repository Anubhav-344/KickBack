// src/features/auth/pages/SupportPage.tsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { useAuthStore } from "../store/useAuthStore";
import FaqList from "../components/FaqList";
import { FAQS } from "../data/faqs";

// STUB — these are placeholder contact details, carried over from the
// original page. Replace with the real support email and number.
const SUPPORT_EMAIL = "hello@respawnlounge.in";
const SUPPORT_PHONE_DISPLAY = "+91 98765 43210";
const SUPPORT_PHONE_HREF = "+919876543210";

// Layout: on mobile one column, in this order: raise-a-ticket, FAQs, contact.
// On desktop the page fills the screen below the header: the questions on the
// left (the list scrolls on its own when it does not fit) and a full-height
// panel on the right that stays put and holds the ticket block and contact details.
export default function SupportPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const title = (
    <div className="flex items-center gap-2.5">
      <button onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowLeft size={18} className="text-text-secondary" />
      </button>
      <h1 className="font-display font-semibold text-2xl lg:text-3xl text-text-primary">
        Help &amp; Support
      </h1>
    </div>
  );

  // The mobile and desktop layouts each render these once, so the ids carry a suffix.
  const ticketBlock = (suffix: string) => (
    <section
      aria-labelledby={`ticket-heading-${suffix}`}
      className="bg-bg-surface border border-border-subtle rounded-2xl p-5 lg:p-6"
    >
      <h2
        id={`ticket-heading-${suffix}`}
        className="font-display font-semibold text-lg lg:text-2xl text-text-primary mb-1.5 lg:mb-2"
      >
        Need help with something?
      </h2>
      <p className="text-sm lg:text-base text-text-secondary mb-4 lg:mb-6">
        Raise a ticket and we&apos;ll reply by email.
      </p>
      <div className="flex flex-col gap-2.5">
        <Button
          type="button"
          onClick={() =>
            navigate(isAuthenticated ? "/support/tickets/new" : "/login?redirect=/support/tickets/new")
          }
        >
          Raise a ticket
        </Button>
        {isAuthenticated && (
          <Button type="button" variant="secondary" onClick={() => navigate("/support/tickets")}>
            My tickets
          </Button>
        )}
      </div>
    </section>
  );

  const faqHeading = (suffix: string) => (
    <h2
      id={`faq-heading-${suffix}`}
      className="font-display font-semibold text-lg text-text-primary mb-3"
    >
      Frequently asked questions
    </h2>
  );

  const contactBlock = (suffix: string) => (
    <section aria-labelledby={`contact-heading-${suffix}`}>
      <h2
        id={`contact-heading-${suffix}`}
        className="font-display font-semibold text-lg lg:text-xl text-text-primary mb-3"
      >
        Contact us
      </h2>
      <div className="flex flex-col gap-3 lg:gap-4">
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
    </section>
  );

  return (
    <PageShell title="Help &amp; Support">
      <Header />

      {/* Mobile and tablet: one scrolling column. */}
      <div className="lg:hidden flex-1 w-full px-4 py-6 flex flex-col gap-8">
        <div className="-mb-2">{title}</div>
        {ticketBlock("m")}
        <section aria-labelledby="faq-heading-m">
          {faqHeading("m")}
          <FaqList items={FAQS} />
        </section>
        {contactBlock("m")}
      </div>

      {/* Desktop: fills the screen under the header. The wrapper is relative and the
          inner layout absolute, so it is exactly as tall as the space left on screen
          and only the question list scrolls. */}
      <div className="hidden lg:block flex-1 relative min-h-[520px]">
        <div className="absolute inset-0 flex flex-col px-10 xl:px-16 pt-10">
          <div className="mb-6">{title}</div>

          <div className="flex-1 min-h-0 flex gap-10 xl:gap-16">
            <section aria-labelledby="faq-heading-d" className="flex-1 min-w-0 flex flex-col">
              {faqHeading("d")}
              <div className="flex-1 min-h-0 overflow-y-auto pb-10 pr-2">
                <FaqList items={FAQS} />
              </div>
            </section>

            <aside
              aria-label="Contact and tickets"
              className="w-[380px] xl:w-[440px] flex-shrink-0 overflow-y-auto pb-10 flex flex-col gap-8"
            >
              {/* Invisible copy of the questions heading, so the cards start on the
                  same line as the first question. */}
              <div aria-hidden="true" className="invisible -mb-8">
                {faqHeading("spacer")}
              </div>
              {ticketBlock("d")}
              {contactBlock("d")}
            </aside>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function ContactRow({
  href,
  icon,
  label,
  value,
  className = "",
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3.5 lg:gap-4 bg-bg-surface border border-border-subtle rounded-card px-4 py-3.5 lg:px-5 hover:border-accent/40 transition ${className}`}
    >
      <span className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-bg-raised flex items-center justify-center text-text-secondary flex-shrink-0">
        {icon}
      </span>
      <span>
        <span className="block text-xs lg:text-sm text-text-secondary">{label}</span>
        <span className="block text-sm lg:text-lg font-medium text-text-primary">
          {value}
        </span>
      </span>
    </a>
  );
}