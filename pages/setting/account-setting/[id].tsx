import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Button,
  Center, 
  Fieldset,
  Group, 
  PasswordInput,
  SegmentedControl,
  Stack, 
  Text,
  TextInput,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { useClientAccountForm, ClientAccountFormValues, } from 'context/account-setting-form';
import { useRouter } from 'next/router';
import { clientAccountsState } from '..';
import { IconArrowBack, IconTrash } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { TClientAccountCreate } from 'types';
import { createClientAccount, deleteClientAccount } from 'api/client';


export default function ClientAccountEntry () {
  const router = useRouter();
  
  const { data: sessionData } = useSession();
  const userId = sessionData && sessionData.user ? sessionData.user.id : '';
  const token = sessionData && sessionData.user ? sessionData.user.token : '';
  
  const accountId = router.query.id ? router.query.id as string : '';
  const emptyUUID = '00000000-0000-0000-0000-000000000000';
  const isNew = accountId === emptyUUID;
  const clientAccount = isNew ? undefined : clientAccountsState.value.find(i => i.id === accountId);
  
  const form = useClientAccountForm ({
    initialValues: {
      platformAccountId: isNew ? '' : clientAccount?.platformAccountId ?? '',
      country: isNew ? 'SG' : clientAccount?.country ?? 'SG',
      isDemo:  isNew ? true : clientAccount?.isDemo ?? true,
      apiKey: isNew ? '' : clientAccount?.apiKey ?? '',
      userName: isNew ? '' : clientAccount?.userName ?? '',
      password: isNew ? '' : clientAccount?.password ?? '',
      currencyCode: isNew ? 'SGD' : clientAccount?.currencyCode ?? 'SGD',
      platform: isNew ? 'IG' : clientAccount?.platform ?? 'IG',
    }
  })
  
  const createMutation = useMutation({
    mutationFn: (param: {userId: string, account: TClientAccountCreate}) => createClientAccount(param.userId, param.account, token)
  });

  const deleteMutation = useMutation({
    mutationFn: (accountId: string) => deleteClientAccount(accountId, token)
  });

  const handleSubmit = async (values: ClientAccountFormValues) => {
      await createMutation.mutateAsync({
        userId: userId,
        account: {
        platformAccountId: values.platformAccountId,
        country: values.country,
        isDemo:  values.isDemo,
        apiKey: values.apiKey,
        userName: values.userName,
        password: values.password,
        platform: values.platform,
    }}, {
      onSuccess: () => {
        notifications.show({
          title: 'Setting > Add Account',
          message: 'New account has been created',
        }); 
        router.push('/setting');
      },
      onError: (error, variables, context) => {
        console.log(error);
        notifications.show({
          title: 'Setting > Add Account',
          message: error.message,
        });
      }
    });
  }
  
  const handleDelete = async () => {
    await deleteMutation.mutateAsync(accountId,
    {
      onSuccess: () => {
        notifications.show({
          title: 'Setting > Delete Account',
          message: 'Account has been deleted',
        }); 
        router.push('/setting');
      },
      onError: (error) => {
        console.log(error);
        notifications.show({
          title: 'Setting > Delete Account',
          message: error.message,
        });
      }
    });
  }
  
  const openDeleteModal = () => modals.openConfirmModal({
      title: 'Delete your trading account',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete your trading account?         
        </Text>
      ),
      labels: { confirm: 'Delete account', cancel: "No don't delete!" },
      confirmProps: { color: 'red', variant: 'light' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        console.log('Confirmed');
        handleDelete();
      },
    });


  return (
    <Center maw={700}>
      <form onSubmit={form.onSubmit(handleSubmit)} >
        <Fieldset legend='IG Account'>
          <Stack>
            <SegmentedControl fullWidth 
              data={['AU', 'SG']}
              {...form.getInputProps('country')}
            />
            <SegmentedControl fullWidth
              data={['Demo', 'Live']}
              {...form.getInputProps('isDemo')}
              value={ form.getInputProps('isDemo').value === true?'Demo':'Live' }
              onChange={(e) => form.setFieldValue('isDemo', e === 'Demo'?true:false)}
            />
            <TextInput label='IG Account ID' placeholder='eg. LZX09'
              {...form.getInputProps('platformAccountId')}
            />
            { isNew ? '' : 
            <TextInput label='Account Currency' placeholder='eg. SGD'
              {...form.getInputProps('currencyCode')}
            />
            }
            <TextInput label='API Key' placeholder='eg. 8097a7536abe6c089d5f4205b539a6875da2a7d5'
              {...form.getInputProps('apiKey')}
            />
            <TextInput label='API Login Username' placeholder='API login username'
              {...form.getInputProps('userName')}
            />
            <PasswordInput label='API Password' placeholder='API password'
              {...form.getInputProps('password')}
            />
            <Group justify='flex-end' mt='md'>
              
              <Button leftSection={<IconArrowBack/>} component={Link} href='/setting'></Button>
              { isNew  
                  ? <Button type='submit' variant='outline'>Save</Button> 
                  : <Button onClick={openDeleteModal} variant='outline' leftSection={<IconTrash />}></Button> 
              }
            </Group>
          </Stack>
        </Fieldset>
      </form>
      
      {/* {consolelog} */}
    </Center>
    
  )
}
