import { getKantorById } from '../service';

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);

        const data = await getKantorById(id);
        
        return {
            message: 'Success Update Kantor',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
