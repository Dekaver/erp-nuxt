import { getAccountById } from '../service';

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);

        const data = await getAccountById(id);
        
        return {
            message: 'Success Get Account',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
