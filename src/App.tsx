import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import { Auth } from "@/components/auth/Auth";
import { AuthRoute } from "@/components/auth/AuthRoute";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <AuthRoute>
                <Index />
              </AuthRoute>
            }
          />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;