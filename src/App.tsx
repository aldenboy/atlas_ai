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
    },
  },
});

const App = () => {
  // Check if we're on atlas.lovable.app
  const isAtlasDomain = window.location.hostname === 'atlas.lovable.app';

  // If we're on atlas.lovable.app, we want to show the Index component
  if (isAtlasDomain) {
    return (
      <QueryClientProvider client={queryClient}>
        <Index />
        <Toaster />
      </QueryClientProvider>
    );
  }

  // Otherwise, show the regular router setup
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Index />} />
          <Route path="/community" element={<Community />} />
          {/* Catch all other routes and redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;