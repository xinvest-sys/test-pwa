import SignalLog from '@/components/SignalLog';
import { useQuery } from '@tanstack/react-query';
import { getLogs } from '@/api/notification';
import { useSession } from 'next-auth/react';
import Loading from '@/components/Loading';
import { Center } from '@mantine/core';

export default function Home() {
  const { data: sessionData } = useSession();
  const userId = sessionData && sessionData.user ? sessionData.user.id : '';
  const token = sessionData && sessionData.user ? sessionData.user.token : '';

  const { isLoading, isError, error, data, refetch } = useQuery( { 
    queryKey: ['getSignal'], 
    queryFn: () => getLogs(userId, token), 
  });

  const periods = data && data.summary && data.summary.periods ? data.summary.periods : [];
  const logs = data && data.logs ? data.logs : [];

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>{error.message}</div>
  }

  return (
    <Center> 
      <SignalLog logsData={logs} reload={refetch}/>
    </Center>
  )
}
