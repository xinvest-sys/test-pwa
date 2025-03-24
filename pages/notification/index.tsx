import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Loading from '@/components/Loading';
import dayjs from 'dayjs';
import { 
  Box, 
  Paper, 
  Stack, 
  Button, 
  Center, 
  Switch, 
  rem, 
  Text,
  Alert,
  Table,
} from '@mantine/core';
import { 
  IconInfoCircle, 
  IconCheck, 
  IconX,
} from '@tabler/icons-react';
import { 
  createSubscription, 
  deleteSubscription, 
  test,
  getTestLogs,
} from '@/api/notification';


/// https://www.totaltypescript.com/how-to-properly-type-window
// declare const window: {
//   workbox: any;
// } & Window;


const base64ToUint8Array = (base64: string | undefined) => {
  if (base64) {
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  
    const rawData = window.atob(b64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  } else {
    throw new Error('Invalid web push public key.');
  }
}

const notificationSupported = () => {
  if (typeof window === "undefined") {
    console.log("typeof window === undefined");
    return false;
  } else if (!("serviceWorker" in navigator)) {
    console.log("!(serviceWorker in navigator)");
    return false;
  } else if (!("PushManager" in window)) {
    console.log("!(PushManager in window)");
    return false;
  } else if (!("showNotification" in ServiceWorkerRegistration.prototype)) {
    console.log("!('showNotification' in ServiceWorkerRegistration.prototype)");
    return false;
    // } else if (window.serwist === undefined) {
    //   console.log("window.serwist === undefined");
    //   return false;
  } else {
    return true;
  }
};

const Messager = (props: {message: string}) => (
  <Alert 
    w='350' 
    h='auto' 
    color='red' 
    variant='filled' 
    title='Something went wrong...' 
    icon={<IconInfoCircle />}
  >
    <Text size='xs'>
      {props.message}
    </Text>
  </Alert>
);


const SubscribeOptions = (props: { checked: boolean, setChecked: (value: boolean) => void}) => (
  <Switch
    disabled={true}
    color='blue'
    size='md'
    label='🤖 Price Watcher'
    checked={props.checked}
    onChange={(event) => props.setChecked(event.currentTarget.checked)}
    thumbIcon={
      props.checked ? (
        <IconCheck
          style={{ width: rem(12), height: rem(12) }}
          color='blue'
          stroke={3}
        />
      ) : (
        <IconX
          style={{ width: rem(12), height: rem(12) }}
          color='red'
          stroke={3}
        />
      )
    }
  />
);

// const LogListing = (props: { elements: JSX.Element[], reload: () => Promise<any> }) => (
//   <Table 
//     mt={60}
//     striped 
//     withTableBorder 
//     stickyHeader 
//     stickyHeaderOffset={60} 
//   >
//     <Table.Thead>
//       <Table.Tr>
//         <Table.Th>Sent at</Table.Th>
//         <Table.Th>Title</Table.Th>
//         <Table.Th>Message</Table.Th>
//       </Table.Tr>
//     </Table.Thead>
//     <Table.Tbody>{props.elements}</Table.Tbody>
//     <Table.Caption>
//       <Link 
//         href='' 
//         prefetch={false}
//         onClick={() => props.reload()}
//         style={{ 
//           color: 'red', 
//           fontSize: '14px', 
//           fontWeight: 'bold' 
//         }}
//       >
//         Reload the logs
//       </Link>
//     </Table.Caption>
//   </Table>
// );

export default function NotificationMain() {
  const { data: sessionData } = useSession();
  const userId = sessionData && sessionData.user ? sessionData.user.id : "";
  const token = sessionData && sessionData.user ? sessionData.user.token : "";

  console.table(sessionData);
  if (userId === "") {
    console.log(`notifications.tsx: Invalid or empty user Id.`);
  }

  const [checked, setChecked] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessSubscribe, setIsProcessSubscribe] = useState(false);
  const [isProcessUnsubscribe, setIsProcessUnsubscribe] = useState(false);
  const [isProcessTest, setIsProcessTest] = useState(false);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // const { isLoading, isError, error: logsError, data: logsData, refetch } = useQuery( {
  //   queryKey: ['getLogs'],
  //   queryFn: () => getTestLogs(userId, token),
  // });

  useEffect(() => {
    // if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
    if (notificationSupported()) {
      console.log("SW supported");
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (
            sub &&
            !(
              sub.expirationTime &&
              Date.now() > sub.expirationTime - 5 * 60 * 1000
            )
          ) {
            setSubscription(sub);
            setIsSubscribed(true);
          }
        });
        setRegistration(reg);
      });
    } else {
      alert("SW NOT Supported!!");
    }
  }, []);

  // const logs = useMemo(() => {
  //   return !logsData
  //     ? []
  //     : logsData.map(l => (
  //         <Table.Tr key={l.id}>
  //           <Table.Td fz='xs'>{dayjs(l.sentAt).format('YYYY-MM-DD HH:mm:ss')}</Table.Td>
  //           <Table.Td fz='xs'>{l.title}</Table.Td>
  //           <Table.Td fz='xs'>{l.message}</Table.Td>
  //         </Table.Tr>
  //       ));
  // }, [logsData]);

  const handleSubscribe = async (event: any) => {
    if (!process.env.NEXT_PUBLIC_WEBPUSH_PUBLIC_KEY) {
      throw new Error("Environment variables supplied not sufficient.");
    }
    if (!registration) {
      alert("No SW registration available.");
      console.error("No SW registration available.");
      return;
    }
    event.preventDefault();
    setIsProcessSubscribe(true);

    // if (registration) {
      const subs = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(
          process.env.NEXT_PUBLIC_WEBPUSH_PUBLIC_KEY
        ),
      });

      try {
        const response = await createSubscription(userId, subs, token);
        if (response.ok) {
          setSubscription(subs);
          setIsSubscribed(true);
          setError(null);
          console.log("web push subscribed!");
          console.log(subs);
        }
      } catch (err: any) {
        setError(err.message);
      }
    // }
    setIsProcessSubscribe(false);
  };

  const handleUnsubscribe = async (event: any) => {
    if (!subscription) {
      console.error("Web-push not subscribed");
      return;
    }
    event.preventDefault();
    setIsProcessUnsubscribe(true);

    // if (subscription) {
    await subscription.unsubscribe();
    const { endpoint } = subscription;

    try {
      const response = await deleteSubscription(endpoint, token);
      if (response.ok) {
        setSubscription(null);
        setIsSubscribed(false);
        setError(null);
        console.log("web push unsubscribed!");
      }
    } catch (err: any) {
      setError(err.message);
      setIsSubscribed(false);
    }
    //  }
    setIsProcessUnsubscribe(false);
  };

  const handleTest = async (event: any) => {
    if (!subscription) {
      alert("Web push not subcribed!!");
      console.error("Web push not subscribed");
      return;
    }
    event.preventDefault();
    setIsProcessTest(true);

    try {
      const response = await test(userId, token);
      if (response.ok) {
        setError(null);
        // refetch();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessTest(false);
    }
  };

  // if (isLoading) {
  //   return <Loading />;
  // }

  // if (isError) {
  //   return  <Messager message={logsError.message} />
  // }

  return (
    <Box>
      <Center>
        <Stack>
          <Button
            w="350"
            variant="outline"
            size="md"
            radius="lg"
            loading={isProcessSubscribe}
            disabled={isSubscribed}
            onClick={handleSubscribe}
          >
            Subscribe
          </Button>
          <Button
            w="350"
            variant="outline"
            size="md"
            radius="lg"
            loading={isProcessUnsubscribe}
            disabled={!isSubscribed}
            onClick={handleUnsubscribe}
          >
            Unsubscribe
          </Button>
          <Button
            w="350"
            variant="outline"
            size="md"
            color="red"
            radius="lg"
            loading={isProcessTest}
            hidden={!isSubscribed}
            onClick={handleTest}
          >
            Test
          </Button>
          {isSubscribed ? (
            <Paper w="350" shadow="sm" radius="md" withBorder p="xl">
              <Text mb="md" size="sm">
                You will reveive the following notifications:
              </Text>
              <SubscribeOptions checked={checked} setChecked={setChecked} />
            </Paper>
          ) : null}
          {error ? <Messager message={error} /> : null}
          {
            // isSubscribed ? (
            //   <LogListing elements={logs} reload={refetch} />
            // ) : null
          }
        </Stack>
      </Center>
    </Box>
  );
}