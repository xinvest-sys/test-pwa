import { createFormContext } from '@mantine/form';
import { TClientAccount } from '../types';

export type ClientAccountFormValues = Omit<TClientAccount, 'id' | 'isActive'>;

export const [ClientAccountFormProvider, useClientAccountFormContext, useClientAccountForm] =
  createFormContext<ClientAccountFormValues>();