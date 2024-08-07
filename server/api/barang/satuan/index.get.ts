import { getSatuan } from './service';

export default defineEventHandler(async (event) => {
    try {
        const data = await getSatuan();
        return {
            message: 'Success Get Satuan',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
