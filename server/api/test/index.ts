export default defineEventHandler((event) => {
    if (event.method === 'GET') {
        return {
            hello: 'get',
        };
    }

    if (event.method === 'POST') {
        return {
            hello: 'post',
        };
    }
});
