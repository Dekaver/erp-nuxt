import { ref } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
    const isLoading = ref(false);
    // Menambahkan properti global
    nuxtApp.vueApp.config.globalProperties.$isLoading = isLoading;

    // Menambahkan metode global
    nuxtApp.vueApp.config.globalProperties.$timeoutLoading = () => {
        setTimeout(() => {
            isLoading.value = false;
        }, 1200);
    };
});
