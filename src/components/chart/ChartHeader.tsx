interface ChartHeaderProps {
  title: string;
  subtitle: string;
}

export const ChartHeader = ({ title, subtitle }: ChartHeaderProps) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
};