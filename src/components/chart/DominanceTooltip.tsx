interface DominanceTooltipProps {
  active?: boolean;
  payload?: any[];
}

export const DominanceTooltip = ({ active, payload }: DominanceTooltipProps) => {
  if (active && payload && payload.length) {
    const dominance = payload[0].value as number;
    return (
      <div className="bg-background/95 p-2 rounded-lg border border-border shadow-lg backdrop-blur-md">
        <p className="text-sm font-medium">BTC Dominance</p>
        <p className="text-sm text-muted-foreground">{dominance.toFixed(2)}%</p>
      </div>
    );
  }
  return null;
};