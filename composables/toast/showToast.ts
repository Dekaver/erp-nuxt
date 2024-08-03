/**
 * Shows a toast notification with the provided form data.
 * 
 * @param {Object} form - The form data containing the severity, summary and message of the notification.
 * @param {string} form.severity - The severity of the notification (default: 'success').
 * @param {string} form.summary - The summary of the notification (default: 'Information').
 * @param {string} form.message - The message of the notification.
 * @returns {void}
 */
import { useToast } from 'primevue/usetoast';

export const showToast = (form: { severity?: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'; sumary?: string; message?: string }) => {
    // Get the Nuxt app instance
    const nuxtApp = useNuxtApp();

    /**
     * Retrieves the toast instance from the global properties of the Vue app.
     * 
     * @returns {typeof useToast} The toast instance.
     */
    const getToast: typeof useToast = () => nuxtApp.vueApp.config.globalProperties.$toast;

    // Add a new toast notification with the provided form data
    return getToast().add({
        severity: form.severity || 'success', // Set the severity of the notification (default: 'success')
        summary: form.sumary || 'Information', // Set the summary of the notification (default: 'Information')
        detail: form.message, // Set the message of the notification
        life: 3000, // Set the life duration of the notification (default: 3000ms)
    });
};

