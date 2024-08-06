// store/loading.ts
import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
    progress: 0, // Menyimpan persentase loading
  }),
  actions: {
    startLoading() {
      this.isLoading = true;
      this.progress = 0; // Atur persentase kembali ke 0 saat loading dimulai
    },
    updateProgress(progress) {
      this.progress = progress;
    },
    stopLoading() {
      this.isLoading = false;
      this.progress = 100; // Set persentase ke 100 saat loading selesai
    },

    // Menambahkan fungsi lain
    timeoutLoading() {
      setTimeout(() => {
        this.isLoading = false;
        this.progress = 100; // Set persentase ke 100 saat loading selesai
      }, 1200);
    },
  },
});
