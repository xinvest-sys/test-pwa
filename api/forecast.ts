import { Fetch } from '@/utils/fetch2';
import { TDiagramUrl, TForecastData } from '@/types/index';

export async function getHsiDiagramUrls(token: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/forecast/get-diagram-urls`;
  return await new Fetch<TDiagramUrl[]>()
    .setUrl(url)
    .setToken(token)
    .GET();
}


export async function getLatestForecast(token: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/forecast/get-latest-forecast`; 
  return await new Fetch<TForecastData[]>()
    .setUrl(url)
    .setToken(token)
    .GET();
}