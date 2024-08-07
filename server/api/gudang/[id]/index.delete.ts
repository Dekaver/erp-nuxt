import { deleteGudang } from '../service';

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);

        const data = await deleteGudang(id);
        return {
            message: 'Success Update Gudang',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
