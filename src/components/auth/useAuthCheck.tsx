import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAuthCheck = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const clearSession = async () => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.error("Error clearing session:", error);
    }
    
    navigate("/auth");
  };

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          if (location.pathname !== "/") {
            await clearSession();
          }
          return;
        }

        if (!session) {
          if (location.pathname !== "/") {
            await clearSession();
          }
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("User verification error:", userError);
          if (location.pathname !== "/") {
            await clearSession();
          }
          return;
        }

        if (mounted) {
          setIsAuthenticated(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (location.pathname !== "/") {
          await clearSession();
        }
      } finally {
        if (mounted && location.pathname === "/") {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        if (location.pathname !== "/") {
          await clearSession();
        }
        return;
      }
      
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed");
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