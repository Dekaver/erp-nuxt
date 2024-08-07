import { getProyekById } from '../service';

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);

        const data = await getProyekById(id);
        
        return {
            message: 'Success Update Proyek',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
