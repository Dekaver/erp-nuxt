import { updateGudangSchema } from "@/databases/gudang/schema";
import { updateGudang } from "../service";

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);
        const body = await readBody(event);
        const user = getUser(event);
        const validate = updateGudangSchema.parse({
            ...body,
            updated_by: user!.id
        });
        const data = await updateGudang(id, validate);
        return {
            message: 'Success Update Gudang',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
})