import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const AuthProjectOverview = () => {
  return (
    <Card className="bg-background/50 backdrop-blur-sm border-primary/20 min-h-[400px] md:h-[500px] flex flex-col">
      <CardHeader className="space-y-2 md:space-y-4">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/6c0018a5-7e4b-44eb-8ac7-f18fefc2076a.png" 
            alt="ATLAS Logo" 
            className="h-12 w-auto mb-2"
          />
        </div>
        <CardTitle className="text-center text-xl md:text-2xl">
          Automated Trading and Learning Analysis System
        </CardTitle>
        <CardDescription className="text-center">
          Discover what makes ATLAS unique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 px-4 md:px-6">
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
        <div className="space-y-2">
          <h3 className="font-semibold">🔒 Secure & Reliable</h3>
          <p className="text-sm text-muted-foreground">
            Built with enterprise-grade security and real-time data synchronization for reliable performance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};