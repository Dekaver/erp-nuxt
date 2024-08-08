import { getHariLiburTipeById } from '../service';

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);

        const data = await getHariLiburTipeById(id);
        
        return {
            message: 'Success Update HariLiburTipe',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
