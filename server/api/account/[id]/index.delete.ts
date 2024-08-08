import { deleteAccount } from '../service';

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);

        const data = await deleteAccount(id);
        return {
            message: 'Success Delete Account',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
});
