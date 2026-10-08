// src/App.tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/app/queryClient";
import { router } from "@/app/router";
import ThemeSync from "@/features/auth/components/ThemeSync";
import ErrorBoundary from "@/components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeSync />
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              // CSS variables, so toasts follow the light/dark theme
              background: "var(--color-bg-surface)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border-subtle)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "var(--color-state-available)",
                secondary: "var(--color-bg-surface)",
              },
            },
            error: {
              iconTheme: {
                primary: "var(--color-state-error)",
                secondary: "var(--color-bg-surface)",
              },
            },
          }}
        />
      </QueryClientProvider>
      </ErrorBoundary>
  );
}

export default App;
