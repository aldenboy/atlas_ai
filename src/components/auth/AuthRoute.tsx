import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    // Check initial session
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          // Clear any existing session data
          await supabase.auth.signOut();
          navigate("/auth");
          return;
        }

        if (!session) {
          navigate("/auth");
          return;
        }

        // Verify the session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("User verification error:", userError);
          await supabase.auth.signOut();
          navigate("/auth");
          return;
        }

        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        await supabase.auth.signOut();
        navigate("/auth");
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
        return;
      }
      
      if (event === 'SIGNED_IN' && session) {
        if (mounted) {
          setIsLoading(false);
        }
      }

      // Handle token refresh
      if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed");
        checkAuth();
      }
    });

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};