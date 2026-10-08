// src/features/auth/components/AuthPageLayout.tsx
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import AuthSidePanel from "@/components/layout/AuthSidePanel";
import { LogoMark } from "@/components/ui/Logo";

interface Props {
  pageTitle: string;
  heading: string;
  subheading?: string;
  children: ReactNode;
}

// Same frame as Login/Signup, for the password-recovery pages.
export default function AuthPageLayout({ pageTitle, heading, subheading, children }: Props) {
  const navigate = useNavigate();

  return (
    <PageShell title={pageTitle}>
      <div className="flex items-center gap-3 px-4 lg:px-10 py-3.5 lg:py-6">
        <button onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={18} className="text-text-secondary lg:w-6 lg:h-6" />
        </button>
        <Link to="/" className="flex items-center gap-2 lg:gap-3">
          <LogoMark className="w-6 h-6 lg:w-9 lg:h-9" />
          <span className="font-display font-bold text-lg lg:text-2xl text-text-primary">
            KickBack
          </span>
        </Link>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 lg:w-1/2 flex flex-col justify-center px-6 lg:px-20 py-6 w-full">
          <div className="w-full max-w-2xl mx-auto">
            <h1 className="font-display font-semibold text-2xl lg:text-4xl text-text-primary mb-1.5">
              {heading}
            </h1>
            {subheading && (
              <p className="text-sm lg:text-base text-text-secondary mb-7">{subheading}</p>
            )}
            {children}
          </div>
        </div>
        <AuthSidePanel className="hidden lg:flex lg:w-1/2" />
      </div>
    </PageShell>
  );
}
