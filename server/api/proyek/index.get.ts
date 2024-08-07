import { getProyek } from './service';

export default defineEventHandler(async (event) => {
    try {
        const data = await getProyek();
        return {
            message: 'Success Get Proyek',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
