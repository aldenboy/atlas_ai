import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const ChartError = () => {
  return (
    <Card className="p-6 rounded-xl bg-black/30 backdrop-blur-md border border-purple-500/20">
      <div className="h-[300px] flex flex-col items-center justify-center text-red-500 gap-2">
        <AlertCircle className="w-8 h-8" />
        <div className="text-center">
          <div className="font-medium">Error loading chart data</div>
          <div className="text-sm text-muted-foreground">
            Please try again later
          </div>
        </div>
      </div>
    </Card>
  );
};