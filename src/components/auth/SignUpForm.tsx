import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SignUpFormProps {
  onViewChange: (view: "sign_in" | "sign_up") => void;
}

export const SignUpForm = ({ onViewChange }: SignUpFormProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");

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
    <form onSubmit={handleSignUp} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
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
          onClick={() => onViewChange("sign_in")}
          className="text-primary hover:underline"
        >
          Sign In
        </button>
      </p>
    </form>
  );
};