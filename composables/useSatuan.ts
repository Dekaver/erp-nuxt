import useCrud from './base/useGeneral';
import type { NewSatuan, Satuan, UpdateSatuan } from '../databases/satuan/schema';

export default function useSatuanCrud() {
  return useCrud<Satuan, NewSatuan, UpdateSatuan>('api/satuan');
}