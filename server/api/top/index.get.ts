import { getTop } from "./service";

export default defineEventHandler(async (event) => {
    try {
        const data = await getTop();
        return {
            message: 'Success Update TOP',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
})
