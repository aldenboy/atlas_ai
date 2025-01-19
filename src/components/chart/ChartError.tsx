import { Card } from "@/components/ui/card";

export const ChartError = () => {
  return (
    <Card className="p-6 rounded-xl bg-black/30 backdrop-blur-md border border-purple-500/20">
      <div className="h-[300px] flex items-center justify-center text-red-500">
        Error loading chart data
      </div>
    </Card>
  );
};