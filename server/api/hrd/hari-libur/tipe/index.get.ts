import { getHariLiburTipe } from './service';

export default defineEventHandler(async (event) => {
    try {
        const data = await getHariLiburTipe();
        return {
            message: 'Success Get Tipe',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
