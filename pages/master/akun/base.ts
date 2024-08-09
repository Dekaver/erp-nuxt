import useCrud from '@/composables/base/useGeneral';
import { insertAccountSchema } from '@/databases/account/schema';
import type { NewAccount, Account, account } from '@/databases/account/schema';

export default function useBaseCrud() {
  return useCrud<Account, NewAccount>('api/account');
}

export { insertAccountSchema, type Account, type account }
