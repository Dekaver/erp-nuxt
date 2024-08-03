import type { useToast } from "primevue/usetoast";

export const showErrorToast = (params: string) => {
    const nuxtApp = useNuxtApp();
    const getToast: typeof useToast = () => nuxtApp.vueApp.config.globalProperties.$toast
    return getToast().add({
        severity: 'error',
        summary: 'Error !',
        detail: params,
        life: 3000
    })
}