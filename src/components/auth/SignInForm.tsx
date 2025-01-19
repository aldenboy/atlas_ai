import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const SignInForm = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      navigate('/'); // Redirect to home page after successful sign in
    }
  });

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: 'rgb(168, 85, 247)',
                brandAccent: 'rgb(147, 51, 234)',
              },
            },
          },
        }}
        theme="dark"
        providers={[]}
        redirectTo={window.location.origin}
        view="sign_in"
      />
    </>
  );
};