import { getPengguna } from "./service";

export default defineEventHandler(async (event) => {
    try {
        const data = await getPengguna();
        return {
            message: 'Success Update Brand',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
})