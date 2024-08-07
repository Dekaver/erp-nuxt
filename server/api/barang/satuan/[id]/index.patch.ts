import { updateSatuanSchema } from "@/databases/barang/satuan/schema";
import { updateSatuan } from "../service";

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);
        const body = await readBody(event);
        const user = getUser(event);
        const validate = updateSatuanSchema.parse({
            ...body,
            created_by: user!.id,
            updated_by: user!.id
        });
        const data = await updateSatuan(id, validate);
        return {
            message: 'Success Update Satuan',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
})