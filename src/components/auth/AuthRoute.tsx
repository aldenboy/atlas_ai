import { Loader2 } from "lucide-react";
import { useAuthCheck } from "./useAuthCheck";
import { useLocation } from "react-router-dom";

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated } = useAuthCheck();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Allow public access to homepage
  if (location.pathname === "/" && !isAuthenticated) {
    return <>{children}</>;
  }

  // Require authentication for other routes
  return isAuthenticated ? <>{children}</> : null;
};