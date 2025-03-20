import Head from 'next/head';
import SignalLog from '@/components/SignalLog';
import { useQuery } from '@tanstack/react-query';
import { getTestLogs } from '@/api/notification';
import { useSession } from 'next-auth/react';
import Loading from '@/components/Loading';

export default function Home() {
  const { data: sessionData } = useSession();
  const userId = sessionData && sessionData.user ? sessionData.user.id : '';
  const token = sessionData && sessionData.user ? sessionData.user.token : '';

  const { isLoading, isError, error, data, refetch } = useQuery( { 
    queryKey: ['getLogs'], 
    queryFn: () => getTestLogs(userId, token), 
  });

  const logsData = data ? data : [];

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>{error.message}</div>
  }

  return (
    <>
      <Head>
        <title>apiTrader.app</title>
        <meta name="description" content="apiTrader.app (xinvest-pwa)" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="text-3xl font-bold">
          Welcome to apiTrader.app
        </h1>
        <SignalLog logsData={logsData} reload={refetch}/>
      </main>
    </>
  )
}
