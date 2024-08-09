import useCrud from '@/composables/base/useGeneral';
import { insertAbsenTempatSchema } from '@/databases/hrd/absen_tempat/schema';
import type { AbsenTempat, NewAbsenTempat } from '@/databases/hrd/absen_tempat/schema';

export default function useBaseCrud() {
  return useCrud<AbsenTempat, NewAbsenTempat>('api/hrd/absen_tempat');
}

export { insertAbsenTempatSchema, type AbsenTempat }