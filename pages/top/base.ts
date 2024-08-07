import useCrud from '@/composables/base/useGeneral';
import { insertTopSchema } from '@/databases/top/schema';
import type { NewTop, Top, UpdateTop, top } from '@/databases/top/schema';

export default function useBaseCrud() {
  return useCrud<Top, NewTop, UpdateTop>('api/top');
}

export { insertTopSchema, type Top, type top }
