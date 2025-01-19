import { useEffect, useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FibonacciBackground } from "@/components/FibonacciBackground";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Auth = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
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

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

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
              <Button 
                className="w-full mt-4" 
                onClick={() => navigate("/")}
                variant="secondary"
              >
                <Rocket className="mr-2 h-4 w-4" />
                Launch App
              </Button>
            </CardContent>
          </Card>

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
              {errorMessage && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              {view === "sign_up" ? (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Choose a password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Sign Up</Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setView("sign_in")}
                      className="text-primary hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </form>
              ) : (
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
                      onClick={() => setView("sign_up")}
                      className="text-primary hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};