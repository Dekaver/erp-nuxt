import { useToast } from "primevue/usetoast";

export const showSuccessToast = (params: string) => {
    const nuxtApp = useNuxtApp();
    const getToast: typeof useToast = () => nuxtApp.vueApp.config.globalProperties.$toast
    return getToast().add({
        severity: 'success',
        summary: 'Success',
        detail: params,
        life: 3000
    })
}