import useCrud from '@/composables/base/useGeneral';
import { insertHariLiburTipeSchema } from '@/databases/hrd/hari-libur/tipe/schema';
import type { NewHariLiburTipe, HariLiburTipe, UpdateHariLiburTipe } from '@/databases/hrd/hari-libur/tipe/schema';

export default function useBaseCrud() {
  return useCrud<HariLiburTipe, NewHariLiburTipe, UpdateHariLiburTipe>('api/hrd/hari-libur/tipe');
}

export { insertHariLiburTipeSchema, type HariLiburTipe }