import { insertSatuanSchema } from "@/databases/barang/satuan/schema";
import { createSatuan } from "./service";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const user = getUser(event);

        const validate = insertSatuanSchema.parse({
            ...body,
            created_by: user!.id,
            updated_by: user!.id
        });
        const data =  await createSatuan(validate);
        return { data };
    } catch (error) {
        return handleError(event, error);
    }
})