// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ['@primevue/nuxt-module', '@pinia/nuxt', '@nuxtjs/tailwindcss'],

    // PRIMEVUE
    primevue: {
        // importTheme: { from: '@primevue/themes/aura' },
        importTheme: { from: '@/theme.js' },
        usePrimeVue: true,
        options: {
            theme: {
                preset: 'lara-light',
            },
            ripple: true,
        },
        components: {
            include: '*',
            exclude: ['Sidebar'],
        },
        composables: {
            include: ['useStyle'],
        },
        directives: {
            prefix: '',
            include: ['Ripple'],
        },
    },
    // TAILWIND
    tailwindcss: {
        cssPath: ['~/assets/css/tailwind.css', { injectPosition: 'first' }],
        configPath: 'tailwind.config',
        exposeConfig: {
            level: 2,
        },
        config: {},
        viewer: true,
    },

    // PINIA
    pinia: {
        disableVuex: true,
        storesDirs: ['stores'],
    },

    // OTHER
    plugins: ['~/plugins/global-variable.js'],
    ssr: false,
    css: ['primeicons/primeicons.css'],
    compatibilityDate: '2024-07-27',
});
