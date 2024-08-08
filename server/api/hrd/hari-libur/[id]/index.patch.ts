import { updateHariLiburSchema } from "@/databases/hrd/hari-libur/schema";
import { updateHariLibur } from "../service";

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);
        const body = await readBody(event);
        const user = getUser(event);
        const validate = updateHariLiburSchema.parse({
            ...body,
            updated_by: user!.id
        });
        const data = await updateHariLibur(id, validate);
        return {
            message: 'Success Update HariLibur',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
})