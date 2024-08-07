import useCrud from '@/composables/base/useGeneral';
import { insertSatuanSchema } from '@/databases/barang/satuan/schema';
import type { NewSatuan, Satuan, UpdateSatuan, satuan } from '@/databases/barang/satuan/schema';

export default function useBaseCrud() {
  return useCrud<Satuan, NewSatuan, UpdateSatuan>('api/barang/satuan');
}

export { insertSatuanSchema, type Satuan, type satuan }