export type TForecastData = {
  product: string;
  ticker: string;
  title: string;
  startPeriod: Date;
  endPeriod: Date;
  high: number | null;
  low: number | null;
  axial: number | null;
};
