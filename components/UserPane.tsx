import { 
  Avatar,
  Anchor,
  Stack,
  Text,
} from '@mantine/core';
import { signOut, useSession } from "next-auth/react";

export default function UserPane() {
  const { data: sessionData } = useSession();

  return (
    <>
      <Stack align="flex-end" gap="0.5">
        <Text size="sm">{sessionData && sessionData.user?.email}</Text>
        <Anchor size="sm" href="#" onClick={() => void signOut({ 
          callbackUrl: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/login?callbackUrl=https://localhost:4000` }
        )}>
          Sign out
        </Anchor>
      </Stack>
      {/* <Avatar radius="xl" /> */}
    </>
  );
}