import useCrud from '@/composables/base/useGeneral';
import type { NewProyek, Proyek, UpdateProyek } from '@/databases/proyek/schema';
import { type proyek, insertProyekSchema } from '@/databases/proyek/schema';

export default function useBaseCrud() {
  return useCrud<Proyek, NewProyek, UpdateProyek>('api/proyek');
}

export { insertProyekSchema }
export type { proyek, Proyek }