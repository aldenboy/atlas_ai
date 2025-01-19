import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Landing from "@/pages/Landing";
import Community from "@/pages/Community";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Disable refetch on window focus
    },
  },
});

const App = () => {
  // Check if we're on atlas.lovable.app
  const isAtlasDomain = window.location.hostname === 'atlas.lovable.app';

  return (
    <QueryClientProvider client={queryClient}>
      {isAtlasDomain ? (
        // If we're on atlas.lovable.app, show only the Index component
        <>
          <Index />
          <Toaster />
        </>
      ) : (
        // Otherwise, show the regular router setup
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<Index />} />
            <Route path="/community" element={<Community />} />
            {/* Catch all other routes and redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </Router>
      )}
    </QueryClientProvider>
  );
};

export default App;
