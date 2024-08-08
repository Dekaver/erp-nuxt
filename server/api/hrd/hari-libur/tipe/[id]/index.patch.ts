import { updateHariLiburTipeSchema } from "@/databases/hrd/hari-libur/tipe/schema";
import { updateHariLiburTipe } from "../service";

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);
        const body = await readBody(event);
        const user = getUser(event);
        const validate = updateHariLiburTipeSchema.parse({
            ...body,
            updated_by: user!.id
        });
        const data = await updateHariLiburTipe(id, validate);
        return {
            message: 'Success Update HariLiburTipe',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
})