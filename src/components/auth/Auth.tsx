import { useEffect, useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FibonacciBackground } from "@/components/FibonacciBackground";

export const Auth = () => {
  const [errorMessage, setErrorMessage] = useState("");
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
      <FibonacciBackground />
      
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-primary animate-fade-in">
          Welcome to Atlas
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-8 animate-fade-in delay-100">
          Your AI-Powered Market Intelligence Platform
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>Discover what makes Atlas unique</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">🤖 AI-Powered Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced machine learning algorithms analyze market trends and sentiment in real-time.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">📈 Market Intelligence</h3>
                <p className="text-sm text-muted-foreground">
                  Get comprehensive insights into market movements and trading opportunities.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">👥 Community Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Join a vibrant community of traders and investors sharing insights and strategies.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Access your account or create a new one</CardDescription>
            </CardHeader>
            <CardContent>
              {errorMessage && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{errorMessage}</AlertDescription>
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
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};