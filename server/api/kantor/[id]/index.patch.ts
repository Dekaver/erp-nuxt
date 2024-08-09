import { updateKantorSchema } from "@/databases/kantor/schema";
import { updateKantor } from "../service";

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);
        const body = await readBody(event);
        const user = getUser(event);
        const validate = updateKantorSchema.parse({
            ...body,
            updated_by: user!.id
        });
        const data = await updateKantor(id, validate);
        return {
            message: 'Success Update Kantor',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
})