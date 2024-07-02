export default defineEventHandler((event) => {
    console.log(event.method);
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
