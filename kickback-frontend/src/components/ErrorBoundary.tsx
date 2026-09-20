// src/components/ErrorBoundary.tsx
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Class component is required here — React error boundaries have no hook
// equivalent (getDerivedStateFromError/componentDidCatch only exist on
// class components). This catches render-time crashes anywhere in the
// tree below it and shows a fallback instead of a blank white screen.
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Real version: report to an error-tracking service (Sentry, etc.)
    console.error("Uncaught render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display font-semibold text-xl text-text-primary mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-text-secondary mb-5">
            An unexpected error occurred. Please try reloading the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-semibold text-accent-hover border border-accent/40 rounded-md px-4 py-2"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
