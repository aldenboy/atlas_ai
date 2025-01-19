import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

interface SignInFormProps {
  onViewChange: (view: "sign_in" | "sign_up") => void;
}

export const SignInForm = ({ onViewChange }: SignInFormProps) => {
  return (
    <>
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
      />
      <p className="text-sm text-center text-muted-foreground mt-4">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => onViewChange("sign_up")}
          className="text-primary hover:underline"
        >
          Sign Up
        </button>
      </p>
    </>
  );
};