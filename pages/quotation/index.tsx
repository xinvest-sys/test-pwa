import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import QuotationTable from '@/components/QuotationTable';
import Loading from '@/components/Loading';
import { Center } from '@mantine/core';
import { TQuote } from 'types';
import { useQuery } from '@tanstack/react-query';
import { getStreamingInfo } from '@/api/client';
const { LightstreamerClient, Subscription } = require('lightstreamer-client');


export default function QuotationMain () {
  const { data: sessionData } = useSession();
  const userId = sessionData && sessionData.user ? sessionData.user.id : '00000000-0000-0000-0000-000000000000';
  const token = sessionData && sessionData.user ? sessionData.user.token : '';
  const [quote, setQuote] = useState<TQuote>();
  const { isLoading, data, isError } = useQuery( { 
    queryKey: ['userId'], 
    queryFn: () => getStreamingInfo(userId, token), 
  });


  useEffect(() => {
    if (!isLoading && data) {
      const client = new LightstreamerClient(data.url, data.isDemo ? 'DEMO' : 'Prod');
      client.connectionDetails.setUser(data.caid);
      client.connectionDetails.setPassword("CST-" + data.cst + "|XST-" + data.xst);
      client.connectionDetails.setAdapterSet("DEFAULT");

      client.connect();
      client.addListener({
        onListenStart: function() {
          console.log('Lightstreamer client - start listening');
        },
        onStatusChange: function(status: any) {
          console.log('Lightstreamer connection status:' + status);
        },
        onServerError: function(errorCode: number, errorMessage: string) {
          console.log("Lightstreamer server error: " + errorCode + " - " + errorMessage);
        }
      });

      const subs = client.getSubscriptions();
      for (const sub of subs) {
        client.unsubscribe(sub);
      }

      client.subscribe(sub);
    }
  }, [data]);

  // function handleClose() {
  //   const subs = client.getSubscriptions();
  //   for (const sub of subs) {
  //     client.unsubscribe(sub);
  //   }
  //   client.disconnect();
  // }
  
  var sub = new Subscription('MERGE', 
    [
      'MARKET:IX.D.NASDAQ.IFG.IP',
      'MARKET:IX.D.SPTRD.IFG.IP',
      'MARKET:IX.D.DOW.IFG.IP',
      'MARKET:IX.D.HANGSENG.IFG.IP', 
      'MARKET:IX.D.NIKKEI.IFG.IP',
      'MARKET:CS.D.CFIGOLD.CFI.IP',
      'MARKET:CS.D.CFISILVER.CFI.IP',
      'MARKET:CC.D.CL.UMG.IP',
      'MARKET:CS.D.EURUSD.CSM.IP',
      'MARKET:CS.D.USDJPY.CSM.IP',
      'MARKET:CS.D.GBPUSD.CSM.IP',
      'MARKET:CS.D.AUDUSD.CSM.IP'
    ],
    ['BID', 'OFFER', 'CHANGE', 'UPDATE_TIME'],
  );

  sub.setDataAdapter('DEFAULT');
  sub.setRequestedSnapshot('yes');
  sub.addListener({
    onSubscription: function () {
      console.log('subscribed');
    },

    onUnsubscription: function () {
      console.log('unsubscribed');
    },

    onSubscriptionError: function (code: number, message: string) {
      console.log('subscription failure: ' + code + ' message: ' + message);
    },

    onItemUpdate: function(obj: any) {
      const newQuote: TQuote = {
        epic: obj.getItemName(),
        bid: obj.getValue('BID'),
        offer: obj.getValue('OFFER'),
        change: obj.getValue('CHANGE'),
        updateTime: obj.getValue('UPDATE_TIME'),
      } 
      setQuote(newQuote);
    }
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Center>
      <QuotationTable quote={quote} />
    </Center>
  );
}