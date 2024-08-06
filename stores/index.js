// store/index.ts
import { createPinia } from 'pinia';
import { useAkunStore } from './account';
import { useAkuntansiStore } from './akuntansi';
import { useGudangStore } from './gudang';
import { useKantorStore } from './kantor';
import { useLoadingStore } from './loading';
import { useSettingStore } from './setting';
import { useUserStore } from './user';
import { useAbilityStore } from './ability';
import { useDepartemenStore } from './departemen';
import { useDivisiStore } from './divisi';

export const pinia = createPinia();

export const setupStore = () => {
  pinia.use(useLoadingStore);
  pinia.use(useUserStore);
  pinia.use(useGudangStore);
  pinia.use(useAkuntansiStore);
  pinia.use(useAkunStore);
  pinia.use(useKantorStore);
  pinia.use(useSettingStore);
  pinia.use(useAbilityStore);
  pinia.use(useDepartemenStore);
  pinia.use(useDivisiStore);
};
