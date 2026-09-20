// src/pages/NotFoundPage.tsx
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFoundPage() {
  return (
    <PageShell>
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display font-semibold text-3xl text-text-primary mb-2">
          404
        </h1>
        <p className="text-sm text-text-secondary mb-5">This page doesn&apos;t exist.</p>
        <Link
          to="/"
          className="text-sm font-semibold text-accent-hover border border-accent/40 rounded-md px-4 py-2"
        >
          Back to Discovery
        </Link>
      </div>
      <Footer />
    </PageShell>
  );
}
