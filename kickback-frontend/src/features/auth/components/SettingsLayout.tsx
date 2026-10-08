// src/features/auth/components/SettingsLayout.tsx
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import AuthSidePanel from "@/components/layout/AuthSidePanel";

interface SettingsLayoutProps {
  /** Page title: the heading and the browser tab. */
  title: string;
  /** Where the back arrow goes. Sub-pages go back to the Settings list. */
  backTo: string;
  backLabel: string;
  children: ReactNode;
}

// Shared frame for every Settings page: the same compact form column with the
// decorative panel on the right that Profile, Login and Signup use.
export default function SettingsLayout({ title, backTo, backLabel, children }: SettingsLayoutProps) {
  return (
    <PageShell title={title}>
      <Header />

      <div className="flex-1 flex">
        <div className="flex-1 lg:w-1/2 px-4 lg:px-16 py-6 lg:py-8 w-full">
          <div className="max-w-md mx-auto w-full">
            <div className="flex items-center gap-2.5 mb-6">
              <Link
                to={backTo}
                aria-label={backLabel}
                className="relative flex items-center justify-center w-6 h-6 before:content-[''] before:absolute before:-inset-2"
              >
                <ArrowLeft size={18} className="text-text-secondary" aria-hidden="true" />
              </Link>
              <h1 className="font-display font-semibold text-2xl text-text-primary">{title}</h1>
            </div>

            {children}
          </div>
        </div>
        <AuthSidePanel className="hidden lg:flex lg:w-1/2" />
      </div>
    </PageShell>
  );
}
