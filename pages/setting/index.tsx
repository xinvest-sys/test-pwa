import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Stack, 
  Button, 
  Badge, 
  Group, 
  Center, 
} from '@mantine/core'
import Link from 'next/link';
import { signal } from '@preact/signals-react';
import { IconEdit, IconSquarePlus, IconBellRinging } from '@tabler/icons-react';
import ReactCountryFlag from 'react-country-flag'
import Loading from '@/components/Loading';
import { useQuery } from '@tanstack/react-query';
import { getClientProfile, getClientAccounts } from '@/api/client';
import { TClientProfile, TClientAccount } from '@/types/index';
import UserPane from '@/components/UserPane';
import { useViewportSize } from '@mantine/hooks';


export const clientAccountsState = signal<TClientAccount[]>([]);
export const clientProfileState = signal<TClientProfile | null>(null);

export default function SettingMain () {
  const { data: sessionData } = useSession();
  const userId = sessionData && sessionData.user ? sessionData.user.id : '';
  const token = sessionData && sessionData.user ? sessionData.user.token : '';
  const { height, width } = useViewportSize();
  const isDesktop = height > 450 &&width > 510;  

  const { isLoading: accountsIsLoading, data: accountsData} = useQuery( { 
    queryKey: ['accounts'], 
    queryFn: () => getClientAccounts(userId, token), 
  });

  const { isLoading: userIsLoading, data: userData, isError, error} = useQuery({ 
    queryKey: ['profile'], 
    queryFn: () => getClientProfile(userId, token), 
  });

  clientProfileState.value = useMemo(() => {
    return !userData 
      ? clientProfileState.value
      : {
          id: userId,
          email: userData.email,
          firstName: userData.firstName,
                    lastName: userData.lastName,
          screenName: userData.screenName,
        };
  }, [userData, userId]);

  clientAccountsState.value = useMemo(() => {
    return !accountsData
      ? clientAccountsState.value
      : accountsData
  }, [accountsData]);

  const displayFlag = (country: string) => {
    return (<div><ReactCountryFlag
      countryCode={country} svg
      style={{fontSize: '1.25em', lineHeight: '1.25em',}}
      /></div>)
  }
    
  let showClientAccountButtons;
  if (clientAccountsState.value.length > 0) {
      showClientAccountButtons = clientAccountsState.value.map( (account, index) => 
        <Button 
          key={index}
          size='xl'
          variant='outline' 
          component={Link} 
          href={`setting/account-setting/${account.id}`}
          rightSection={<IconEdit size='20'/>}
        > 
          {displayFlag(account.country)} {account.platformAccountId} {<Badge color='indigo'>{account.isDemo?'Demo':'Live'}</Badge>}
        </Button>
  )};

  if (userIsLoading || accountsIsLoading) {
    return <Loading />;
  }
  

  return (
    <Center>
      <Stack maw={500}>
        { !isDesktop && <UserPane /> }
        <Button size='md' color='orange'
          component={Link} href='setting/profile-setting/edit-profile'
          rightSection={<IconEdit size='20'/>}
        >Profile</Button>
        <br/>
        { showClientAccountButtons }
        <Group justify='flex-end'>
          <Button size='md'
            component={Link} href='setting/account-setting/00000000-0000-0000-0000-000000000000'
            rightSection={<IconSquarePlus size='20'/>}
          >Account</Button>
        </Group>
        <br/>
        <Button size='md'
          component={Link} href='notification'
          rightSection={<IconBellRinging size='20'/>}
        >Notification</Button>
      </Stack>
    </Center>
  )
}


