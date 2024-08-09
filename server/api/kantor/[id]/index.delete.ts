import { deleteKantor } from '../service';

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);

        const data = await deleteKantor(id);
        return {
            message: 'Success Update Kantor',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
