import { deleteAbsenTempat } from '../service';

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);

        const data = await deleteAbsenTempat(id);
        return {
            message: 'Success Update HariLiburTipe',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
