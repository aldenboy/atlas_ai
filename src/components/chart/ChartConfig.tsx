export interface ChartConfig {
  price: {
    label: string;
    theme: {
      light: string;
      dark: string;
    };
  };
}

export const getChartConfig = (symbol: string): ChartConfig => ({
  price: {
    label: `${symbol.charAt(0).toUpperCase() + symbol.slice(1)} Price (USD)`,
    theme: {
      light: '#7c3aed',
      dark: '#a78bfa',
    },
  },
});