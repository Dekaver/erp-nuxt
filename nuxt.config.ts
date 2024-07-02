// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ['nuxt-primevue', '@pinia/nuxt'],
    primevue: {
        cssLayerOrder: 'reset,primevue',
        options: {
            ripple: true,
        },
        components: {
            include: '*',
        },
    },
    plugins: ['~/plugins/global-variable.js'],
    ssr: false,
    css: ['primevue/resources/themes/lara-light-blue/theme.css', 'primeicons/primeicons.css', 'primeflex/primeflex.css'],
});
