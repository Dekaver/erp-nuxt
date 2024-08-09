import { getBrandById } from '../service';

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);

        const data = await getBrandById(id);
        
        return {
            message: 'Success Update Brand',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
