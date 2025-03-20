import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PinInput,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { notifications } from '@mantine/notifications';
import { verifyPin } from '@/api/client';
import { TVerifyPin } from '@/types/TVerifyPin';
import { useMutation } from '@tanstack/react-query';


export default function VerifyPin() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const token = sessionData && sessionData.user ? sessionData.user.token : '';

  const queryParams = useQueryParams();
  const email = queryParams.get('email');
  let pinError = false;

  const form = useForm({
    initialValues: {
      email: email,
      pinNum: '',
    },
    validate: {
      pinNum: (value) => (!value ? 'Pin is required' : null),
    }
  });

  const verifyMutation = useMutation({
    mutationFn: (pin: TVerifyPin) => verifyPin(pin, token)
  });

  const handleSubmit = async (values: any) => {
    await verifyMutation.mutateAsync({      
      email: values.email,
      pinNum: values.pinNum,
    }, {
      onSuccess: () => {
        notifications.show({
          title: 'Registration > Verify pin',
          message: 'Your profile has been updated',
        }); 
        router.push(`/register/new-profile?email=${email}`);
      },
      onError: (error, variables, context) => {
        notifications.show({
          title: 'Registration > Verify pin',
          message: error.message,
        });
      }
    });
  };

  return (
    <Container size={420} my={40}>
      <Title
        ta="center"
        style={{
          fontFamily: `Greycliff CF, ${'var(--mantine-font-family)'}`,
          fontWeight: 900,
        }}
      >
        Welcome to apiTrader.app!
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput 
            label="Registered Email" 
            placeholder="your_email@example.com" 
            {...form.getInputProps('email')} 
          />
          <Group justify="center" mt="lg">
            <PinInput 
              type="number"
              ariaLabel="4 digits Pin" 
              {...form.getInputProps('pinNum')} 
            />
          </Group>
          <Button variant="outline" type="submit" fullWidth mt="xl">
            Register
          </Button>
          <Text>{ pinError ? 'Pin incorrect! Try again.' : '' }</Text>
        </form>
      </Paper>
      
    </Container>
  );
}
