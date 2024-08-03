import { getBrand } from './service';

export default defineEventHandler(async (event) => {
    try {
        const data = await getBrand();
        return {
            message: 'Success Get Brand',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
