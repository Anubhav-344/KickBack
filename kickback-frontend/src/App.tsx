// src/App.tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/app/queryClient";
import { router } from "@/app/router";
import ErrorBoundary from "@/components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1C1F26", // bg-surface
              color: "#F2F0EA", // text-primary
              border: "1px solid #2E323D", // border-subtle
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#3DDC8C", secondary: "#1C1F26" } },
            error: { iconTheme: { primary: "#F2495C", secondary: "#1C1F26" } },
          }}
        />
      </QueryClientProvider>
      </ErrorBoundary>
  );
}

export default App;
