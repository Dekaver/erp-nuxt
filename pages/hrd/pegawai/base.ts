import useCrud from '@/composables/base/useGeneral';
import { insertPegawaiSchema } from '@/databases/pegawai/schema';
import type { NewPegawai, Pegawai, UpdatePegawai, pegawai } from '@/databases/pegawai/schema';

export default function useBaseCrud() {
  return useCrud<Pegawai, NewPegawai, UpdatePegawai>('api/pegawai');
}

export { insertPegawaiSchema, type Pegawai, type pegawai }