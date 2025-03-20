import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Carousel from '../../components/forecast/Carousel';
import { 
  Center, 
  Stack, 
  Text,
} from '@mantine/core';
import ForecastTable from '../../components/forecast/ForecastTable';
import { getHsiDiagramUrls, getLatestForecast } from '../../api/forecast';
import Loading from '../../components/Loading';
import { useQuery } from '@tanstack/react-query';
import { TDiagramUrl, TForecastData } from '../../types';
// import dayjs from 'dayjs';

const displayForecast = [
  'SP500',
  'DOW',
  'HSI',
  'NIKKEI',
  'GOLD',
  'SILVER',
  'WTI',
  'EURUSD',
  'USDJPY',
  'GBPUSD',
  'AUDUSD'
];

export default function ForecastMain() {
  const { data: sessionData } = useSession();
  const token = sessionData && sessionData.user ? sessionData.user.token : '';

  const { isLoading: hsiDiagramIsLoading, isError, data: hsiDiagramsData, error} = useQuery( { 
    queryKey: ['hsiDiagrams'], 
    queryFn: () => getHsiDiagramUrls(token), 
  });

  const { isLoading: forecastIsLoading, data: forecastData } = useQuery( { 
    queryKey: ['forecast'], 
    queryFn: () => getLatestForecast(token), 
  });

  const hsiDiagrams: TDiagramUrl[] = useMemo(() => {
    return hsiDiagramsData ? hsiDiagramsData : [];
  }, [hsiDiagramsData]);

  let diagramDate = hsiDiagrams.length > 0 ? hsiDiagrams[0].imageDate : '';
  let diagramUrls = hsiDiagrams.length > 0 ? hsiDiagrams.map( (diagram) => diagram.imageUrl) : [];

  const latestForecast = useMemo(() => {
    const data: TForecastData[] = forecastData ? forecastData : [];
    const onlyProduct = data.filter(d => displayForecast.includes(d.product));
    return onlyProduct.map (d => ({ 
      product: d.product, 
      low: d.low, 
      high: d.high, 
      axial: d.axial,
      startPeriod: d.startPeriod,
      endPeriod: d.endPeriod,
    }));
  }, [forecastData]);

  if (hsiDiagramIsLoading || forecastIsLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>{error.message}</div>
  }

  return (
    <Center>
    <Stack>        
      <Text>Extracted: {diagramDate} </Text>
        <Carousel imageUrls={diagramUrls} />
        <ForecastTable data={latestForecast}/>
      </Stack>
    </Center>
  );
}