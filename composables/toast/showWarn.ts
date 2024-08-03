import { useToast } from "primevue/usetoast";

export const showWarnToast = (params: string) => {
    const nuxtApp = useNuxtApp();
    const getToast: typeof useToast = () => nuxtApp.vueApp.config.globalProperties.$toast
    return getToast().add({
        severity: 'warn',
        summary: 'Warning',
        detail: params,
        life: 3000
    })
}