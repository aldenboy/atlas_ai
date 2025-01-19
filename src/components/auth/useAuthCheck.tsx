import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, Session } from "@supabase/supabase-js";

export const useAuthCheck = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const clearSession = async () => {
    try {
      // Clear all Supabase-related items from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Reset state
      setIsAuthenticated(false);
      setIsLoading(false);
      
      // Only redirect if not already on auth page
      if (location.pathname !== "/auth") {
        navigate("/auth", { replace: true });
      }
    } catch (error) {
      console.error("Error clearing session:", error);
      setIsAuthenticated(false);
      setIsLoading(false);
      navigate("/auth", { replace: true });
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error("Session error:", sessionError);
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
          setIsAuthenticated(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        await clearSession();
      }
    };

    // Initial auth check
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        await clearSession();
        return;
      }
      
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      if (event === 'TOKEN_REFRESHED') {
        checkAuth();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return { isLoading, isAuthenticated };
};