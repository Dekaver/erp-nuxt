import { getById } from '../service';

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);

        const data = await getById(id);
        
        return {
            message: 'Success Update HariLiburTipe',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
