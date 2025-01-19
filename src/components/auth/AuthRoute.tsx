import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Clear all session data and storage
  const clearSession = async () => {
    try {
      // Clear all Supabase-related items from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Force a clean signout without trying to call the API
      await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.error("Error clearing session:", error);
    }
    
    // Always navigate to auth page after cleanup
    navigate("/auth");
  };

  useEffect(() => {
    let mounted = true;

    // Check initial session
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          await clearSession();
          return;
        }

        if (!session) {
          await clearSession();
          return;
        }

        // Verify the session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("User verification error:", userError);
          await clearSession();
          return;
        }

        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        await clearSession();
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        await clearSession();
        return;
      }
      
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(false);
        return;
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