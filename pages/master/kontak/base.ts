import useCrud from '@/composables/base/useGeneral';
import { insertKontakSchema } from '@/databases/kontak/schema';
import type { NewKontak, Kontak, kontak } from '@/databases/kontak/schema';

export default function useBaseCrud() {
  return useCrud<Kontak, NewKontak>('api/kontak');
}

export { insertKontakSchema, type Kontak, type kontak }