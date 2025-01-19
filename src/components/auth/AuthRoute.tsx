import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session: userSession } } = await supabase.auth.getSession();
        setSession(!!userSession);
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};