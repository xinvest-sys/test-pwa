import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { 
  AppShell, 
  Burger, 
  Group, 
  Box,
  Center,
  List,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  // IconChartHistogram,
  // IconChartAreaLineFilled,
  // IconChartCandle,
  IconBuildingBroadcastTower,
  IconWorldDollar,
  IconBinoculars,
  IconChartPie,
  IconSettings,
} from '@tabler/icons-react';
import UserPane from './UserPane';

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const pathname = usePathname();
  const [opened, { toggle }] = useDisclosure(true);
  const { height, width } = useViewportSize();

  // if (pathname?.includes('/user/login') || pathname?.includes('/user/register') || pathname?.includes('/verify-pin')) {
  //   return <>children</>;
  // }
  if (pathname?.includes('/register')) {
    return <>{children}</>;
  }

  if (width < 510 || height <450)  {
    return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 60 }}
      padding='md'
    >
      {/* <AppShell.Header> */}
        {/* <Group h='100%' px='md' justify='space-between'> */}
            {/* <Image src='/logo.png' width='45' height='45' alt='appTrader.app'/> */}
            {/* <UserPane /> */}
        {/* </Group> */}
      {/* </AppShell.Header> */}
      <AppShell.Main>{children}</AppShell.Main>
      <AppShell.Footer>
        <Box>
          <Group ml='20' mr='20' h='100%' px='md' justify='space-between'>
            <Link href='/quotation' onClick={toggle}>
              <IconWorldDollar size='60' color='#228be6'/>
            </Link>
            <Link href='/forecast' onClick={toggle}>
              <IconBinoculars size='60' color='#228be6'/>
            </Link>
            <Link href='/portfolio' onClick={toggle}>
              <IconBuildingBroadcastTower size='60' color='#228be6'/>
            </Link>
            <Link href='/setting' onClick={toggle}>
              <IconSettings size='60' color='#228be6' />
            </Link>
          </Group>
        </Box>
      </AppShell.Footer>
      
    </AppShell>
  );
  }
  
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding='md'
    >
      <AppShell.Header bg='#2d4059' c='white'>
        <Group h='100%' px='md' justify='space-between'>
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' color='white' />
            <Image src='/logo.png' width='45' height='45' alt='appTrader.app'/>
          </Group>
          <Group>
            <UserPane />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p='md'>
        <Box style={{ margin: '100px' }} maw={600} mx='auto'>
          <Center>
            <List>
              <List.Item className='cursor-pointer'>
                <Link href='/quotation' onClick={toggle}>
                  <Group>
                    <ThemeIcon color='blue' variant='light'>
                      <IconWorldDollar size='5rem' />
                    </ThemeIcon>
                    <Text size='lg'>Live Prices</Text>
                  </Group>
                </Link>
              </List.Item>
              <List.Item className='cursor-pointer'>
                <Link href='/forecast' onClick={toggle}>
                  <Group>
                    <ThemeIcon color='blue' variant='light'>
                      <IconBinoculars size='5rem' />
                    </ThemeIcon>
                    <Text size='lg'>Forecast</Text>
                  </Group>
                </Link>
              </List.Item>
              <List.Item className='cursor-pointer'>
                <Link href='/portfolio' onClick={toggle}>
                  <Group>
                    <ThemeIcon color='blue' variant='light'>
                      <IconBuildingBroadcastTower size='5rem' />
                    </ThemeIcon>
                    <Text size='lg'>Signal</Text>
                  </Group>
                </Link>
              </List.Item>
              <List.Item className='cursor-pointer'>
                <Link href='/setting' onClick={toggle}>
                  <Group>
                    <ThemeIcon color='blue' variant='light'>
                      <IconSettings size='5rem' />
                    </ThemeIcon>
                    <Text size='lg'>Setting</Text>
                  </Group>
                </Link>
              </List.Item>
            </List>
          </Center>
        </Box>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}



