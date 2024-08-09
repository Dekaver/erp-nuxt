import useCrud from '@/composables/base/useGeneral';
import { insertKantorSchema } from '@/databases/kantor/schema';
import type { NewKantor, Kantor, kantor } from '@/databases/kantor/schema';

export default function useBaseCrud() {
  return useCrud<Kantor, NewKantor>('api/kantor');
}

export { insertKantorSchema, type Kantor, type kantor }