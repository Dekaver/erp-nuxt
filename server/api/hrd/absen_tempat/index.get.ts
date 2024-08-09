import { get } from './service';

export default defineEventHandler(async (event) => {
    try {
        // const query = await getQuery(event) || 2024;
        const data = await get();
        return {
            message: 'Success Get Hari Libur',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
