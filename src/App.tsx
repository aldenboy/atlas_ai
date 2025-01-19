import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Community from "@/pages/Community";
import { Auth } from "@/components/auth/Auth";
import { AuthRoute } from "@/components/auth/AuthRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Index />} />
              <Route
                path="/community"
                element={
                  <AuthRoute>
                    <Community />
                  </AuthRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;