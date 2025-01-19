import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session: userSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setSession(false);
          setLoading(false);
          return;
        }

        if (!userSession) {
          setSession(false);
          setLoading(false);
          return;
        }

        // Verify the session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("User verification error:", userError);
          await supabase.auth.signOut();
          setSession(false);
          setLoading(false);
          return;
        }

        setSession(true);
        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setSession(false);
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setSession(false);
        navigate('/auth', { replace: true });
        return;
      }
      
      if (event === 'SIGNED_IN' && session) {
        setSession(true);
      }

      if (event === 'TOKEN_REFRESHED') {
        checkAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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