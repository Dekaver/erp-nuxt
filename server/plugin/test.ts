export default defineNitroPlugin((nitro) => {
    console.log('===================================');
    nitro.hooks.hook('error', async (error, { event }) => {
        console.error(`${event?._path} Application error:`, error);
    });
});
