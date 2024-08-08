import useCrud from '@/composables/base/useGeneral';
import { insertHariLiburSchema } from '@/databases/hrd/hari-libur/schema';
import type { NewHariLibur, HariLibur, UpdateHariLibur } from '@/databases/hrd/hari-libur/schema';

export default function useBaseCrud() {
  return useCrud<HariLibur, NewHariLibur, UpdateHariLibur>('api/hrd/hari-libur');
}

export { insertHariLiburSchema, type HariLibur }