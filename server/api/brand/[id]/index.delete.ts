import { deleteBrand } from '../service';

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);

        const data = await deleteBrand(id);
        return {
            message: 'Success Update Brand',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
