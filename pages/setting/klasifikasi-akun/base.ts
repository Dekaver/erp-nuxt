// TODO: Sesuaikan dengan Schema dari database

import useCrud from '@/composables/base/useGeneral';
import type { NewAccount, Account, UpdateAccount } from '@/databases/account/schema';
import { type account, insertAccountSchema } from '@/databases/account/schema';

export default function useBaseCrud() {
  return useCrud<Account, NewAccount, UpdateAccount>('api/account');
}

export { insertAccountSchema }
export type { account, Account }