import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import '../styles/globals.css';
import { createTheme, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { type AppType } from "next/app";
import { type Session, type DefaultSession } from "next-auth";
// import { type DefaultSession } from 'next-auth';
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import type { AppProps } from "next/app";
import Head from "next/head";

const APP_NAME = "apiTrader";
const APP_DESCRIPTION = "xInvest Serwist PWA";
const theme = createTheme({
  /** Put your mantine theme override here */
});


const queryClient = new QueryClient();

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string
      token: string
    };
  }
}

// export default function App({ Component, pageProps }: AppProps) {
const App: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps<{ session: Session | null }>) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="application-name" content={APP_NAME} />
        <meta name="description" content={APP_DESCRIPTION} />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons-192x192.png" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>
      <SessionProvider session={session}>
        <MantineProvider theme={theme}><ModalsProvider>
          <QueryClientProvider client={queryClient}>
            <Notifications position="top-right" />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </QueryClientProvider>
        </ModalsProvider></MantineProvider>
      </SessionProvider>
  </>
  );
}

export default App;
