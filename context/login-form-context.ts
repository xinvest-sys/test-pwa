import { createFormContext } from '@mantine/form';

export type LoginFormValues = {
  email: string,
  rememberMe: boolean,
}

export const [LoginFormProvider, useLoginFormContext, useLoginForm] =
  createFormContext<LoginFormValues>();