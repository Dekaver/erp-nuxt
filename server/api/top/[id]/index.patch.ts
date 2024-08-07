import { updateTop } from "../service";
import { updateTopSchema } from '@/databases/top/schema';

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);
        const body = await readBody(event);
        
        const validate = updateTopSchema.parse({
            ...body
        });

        const data = await updateTop(id, validate);
        return {
            message: 'Success Update TOP',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
})
