import { useToast } from "primevue/usetoast";

export const showInfoToast = (params: string) => {
    const nuxtApp = useNuxtApp();
    const getToast: typeof useToast = () => nuxtApp.vueApp.config.globalProperties.$toast
    return getToast().add({
        severity: 'info',
        summary: 'Information',
        detail: params,
        life: 3000
    })
}