import { updateProyekSchema } from "@/databases/proyek/schema";
import { updateProyek } from "../service";

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);
        const body = await readBody(event);
        const user = getUser(event);
        const validate = updateProyekSchema.parse({
            ...body,
            updated_by: user!.id
        });
        const data = await updateProyek(id, validate);
        return {
            message: 'Success Update Proyek',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
})