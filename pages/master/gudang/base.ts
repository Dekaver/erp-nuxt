import useCrud from '@/composables/base/useGeneral';
import { insertGudangSchema } from '@/databases/gudang/schema';
import type { NewGudang, Gudang, gudang } from '@/databases/gudang/schema';

export default function useBaseCrud() {
  return useCrud<Gudang, NewGudang>('api/gudang');
}

export { insertGudangSchema, type Gudang, type gudang }