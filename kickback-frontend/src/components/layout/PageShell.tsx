// src/components/layout/PageShell.tsx
import { Children, isValidElement, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface PageShellProps {
  children: ReactNode;
  /** The page-specific part of the browser tab title: "Checkout" -> "Checkout | KickBack". */
  title?: string;
}

// True until the first page has been shown. Keyboard focus is moved to the new
// page's main region after IN-APP navigation, but not on the very first load,
// where it would just steal focus from the browser's own starting point.
let isFirstPage = true;

/**
 * The outer shell is always full-bleed (100% viewport width, zero margin, no
 * border) — per explicit decision to prioritize true edge-to-edge desktop
 * width over a centered-column look. Pages whose content needs to stay narrower
 * for readability (a login form, a single-column booking flow) manage their
 * OWN inner max-width wrapper.
 *
 * Accessibility, handled once here for every page:
 *  - a "Skip to main content" link (visible only when focused by keyboard)
 *  - a real <main> landmark. Pages keep passing <Header />, content and
 *    <Footer /> as plain children; Header and Footer stay outside <main> and
 *    everything else is put inside it.
 *  - the browser tab title ("<page> | KickBack"), so screen-reader users and
 *    tab/history lists can tell pages apart in an app that never reloads
 *  - after in-app navigation, focus moves to <main> so keyboard and
 *    screen-reader users start at the top of the new page instead of
 *    on a link that no longer exists.
 */
export default function PageShell({ children, title }: PageShellProps) {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = title ? `${title} | KickBack` : "KickBack";
  }, [title]);

  useEffect(() => {
    if (isFirstPage) {
      isFirstPage = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, []);

  const skipToMain = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    mainRef.current?.focus();
  };

  const nodes = Children.toArray(children);
  const isType = (node: ReactNode, type: unknown) => isValidElement(node) && node.type === type;
  const header = nodes.filter((n) => isType(n, Header));
  const footer = nodes.filter((n) => isType(n, Footer));
  const content = nodes.filter((n) => !isType(n, Header) && !isType(n, Footer));

  return (
    <div className="min-h-screen bg-bg-base flex flex-col w-full">
      <a
        href="#main-content"
        onClick={skipToMain}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-accent"
      >
        Skip to main content
      </a>
      {header}
      <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1 flex flex-col focus:outline-none">
        {content}
      </main>
      {footer}
    </div>
  );
}
