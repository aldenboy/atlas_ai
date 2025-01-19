import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const AuthProjectOverview = () => {
  const navigate = useNavigate();

  const handleLaunch = () => {
    navigate("/");
  };

  return (
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
          onClick={handleLaunch}
          variant="secondary"
        >
          <Rocket className="mr-2 h-4 w-4" />
          Launch App
        </Button>
      </CardContent>
    </Card>
  );
};