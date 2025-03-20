import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { 
  Box,
  Center,
  Stack, 
  Group, 
  Button, 
  Fieldset, 
  TextInput, 
} from '@mantine/core'
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useQueryParams } from '../../hooks/useQueryParams';
import { IconArrowBack } from '@tabler/icons-react';
import Link from 'next/link';
import { createClientProfile } from '../../api/client';
import { useMutation } from '@tanstack/react-query';

export default function NewProfile () {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const token = sessionData && sessionData.user ? sessionData.user.token : '';
  const queryParams = useQueryParams();
  const email = queryParams.get('email');
  const updateMutation = useMutation({
    mutationFn: (param: {profile: any}) => createClientProfile(param.profile, token)
  });
  
  const form = useForm ({
    initialValues: {
      email: email,
      firstName: '',
      lastName: '',
      screenName: '',
    },
    validate: {
      // loginEmail: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      firstName: (value) => (!value ? 'Firstname is required' : null),
      lastName: (value) => (!value ? 'Lastname is required' : null),
    }
  });

  const handleSubmit = async (values: any) => {
    await updateMutation.mutateAsync({
      profile: {
        email: email,
        firstName: values.firstName,
        lastName: values.lastName,
        screenName: values.screenName,
      }
    }, {
      onSuccess: () => {
        notifications.show({
          title: 'Registration > register',
          message: 'New client profile created.',
        }); 
        router.push('/setting');
      },
      onError: (error, variables, context) => {
        console.log(error);
        notifications.show({
          title: 'Registration > register',
          message: 'An error occured on create profile.',
        });
      }
    });
  };

  return (
    <Center>
    <Box w={400}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Fieldset>
          <Stack>
            <TextInput label='Email' placeholder='you@email.com'
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
    </Box>
  </Center>
  );
}