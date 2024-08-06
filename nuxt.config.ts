// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ['@primevue/nuxt-module', '@pinia/nuxt', '@nuxtjs/tailwindcss', 'nuxt-permissions'],

    // PRIMEVUE
    primevue: {
        // importTheme: { from: '@primevue/themes/aura' },
        autoImport: false, // disable auto import
        importTheme: { from: '@/theme.js' },
        usePrimeVue: true,
        options: {
            theme: {
                preset: 'lara-light',
            },
            ripple: true,
        },
        components: {
            // Tentukan komponen yang ingin disertakan
            include: '*',
            exclude: ['Calendar', 'Carousel', 'DatePicker'],

        },
        directives: {
            // Tentukan directive yang ingin disertakan
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
