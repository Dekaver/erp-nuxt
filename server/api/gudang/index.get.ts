import { getGudang } from './service';

export default defineEventHandler(async (event) => {
    try {
        const data = await getGudang();
        return {
            message: 'Success Get Gudang',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
