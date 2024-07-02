export default defineEventHandler((event) => {
    console.log(event.method);
    return {
        hello: 'world',
    };
});
