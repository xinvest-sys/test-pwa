import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Center, Stack, Group, Button, Fieldset, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { IconArrowBack } from '@tabler/icons-react';
import Link from 'next/link';
import { clientProfileState } from '..';
import { useRouter } from 'next/router';
import { updateClientProfile } from '../../../api/client';
import { useMutation } from '@tanstack/react-query';
import { TClientProfile } from '../../../types';


export default function ProfileSetting () {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const token = sessionData && sessionData.user ? sessionData.user.token : '';
  
  const updateMutation = useMutation({
    mutationFn: (profile: TClientProfile) => updateClientProfile(profile, token)
  });

  const profile = useMemo(() => {
    return !clientProfileState.value 
      ? {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        screenName: '',
      }
      : clientProfileState.value
  }, [clientProfileState]);

  const form = useForm ({
    initialValues: {
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      screenName: profile.screenName,
    },
    validate: {
      // loginEmail: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      firstName: (value) => (!value ? 'Firstname is required' : null),
      lastName: (value) => (!value ? 'Lastname is required' : null),
    }
  });

  const handleSubmit = async (values: any) => {
    await updateMutation.mutateAsync({      
        id: profile.id,
        email: profile.email,
        firstName: values.firstName,
        lastName: values.lastName,
        screenName: values.screenName,
    }, {
      onSuccess: () => {
        notifications.show({
          title: 'Setting > Edit Profile',
          message: 'Your profile has been updated',
        }); 
        router.push('/setting');
      },
      onError: (error, variables, context) => {
        notifications.show({
          title: 'Setting > Edit Profile',
          message: error.message,
        });
      }
    });
  };

  return (
    <Center >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Fieldset>
          <Stack maw={700}>
            <TextInput label='Email' placeholder='you@email.com' disabled
              {...form.getInputProps('email')}  
            />
            <TextInput label='First Name' placeholder='John (min 3 letters)'
              {...form.getInputProps('firstName')}  
            />
            <TextInput label='Last Name' placeholder='Doe (min 3 letters)'
              {...form.getInputProps('lastName')}  
            />
            <TextInput label='Screen Name' placeholder='SmartTrader (optional)'
              {...form.getInputProps('screenName')}  
            />
            <Group justify='flex-end' mt='md'>
              <Button leftSection={<IconArrowBack/>} component={Link} href='/setting'></Button>
              <Button type='submit' variant='outline'>Save</Button>
            </Group>
          </Stack>
        </Fieldset>
      </form>
    </Center>

  );
}