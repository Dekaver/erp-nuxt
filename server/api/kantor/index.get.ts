import { getKantor } from './service';

export default defineEventHandler(async (event) => {
    try {
        const data = await getKantor();
        return {
            message: 'Success Get Kantor',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
