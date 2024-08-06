// store/user.ts
import { defineStore } from 'pinia';

export const useAkuntansiStore = defineStore('akuntansi', {
  state: () => ({
    year: null,
    month: null,
    pendapatan: null,
    persediaan_hpp: null,
  }),
  actions: {
    setAkuntansi(newAkuntansi) {
      this.year = newAkuntansi.year;
      this.month = newAkuntansi.month;
      this.pendapatan = newAkuntansi.pendapatan;
      this.persediaan_hpp = newAkuntansi.persediaan_hpp;
    },
    clearSetting() {
      this.bulan = null;
      this.month = null;
      this.pendapatan = null;
      this.persediaan_hpp = null;
    },
  },
});
