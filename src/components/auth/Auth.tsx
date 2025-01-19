import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { NeuralBackground } from "@/components/NeuralBackground";
import { AuthProjectOverview } from "./AuthProjectOverview";
import { SignUpForm } from "./SignUpForm";
import { SignInForm } from "./SignInForm";

export const Auth = () => {
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <NeuralBackground />
      
      <div className="w-full max-w-4xl mb-8 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-4 text-primary animate-fade-in">
          Welcome to Atlas
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-8 animate-fade-in delay-100">
          Your AI-Powered Market Intelligence Platform
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <AuthProjectOverview />

          <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>{view === "sign_up" ? "Sign Up" : "Sign In"}</CardTitle>
              <CardDescription>
                {view === "sign_up" 
                  ? "Create your account to join our community" 
                  : "Access your account or create a new one"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {view === "sign_up" ? (
                <SignUpForm onViewChange={setView} />
              ) : (
                <SignInForm onViewChange={setView} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};