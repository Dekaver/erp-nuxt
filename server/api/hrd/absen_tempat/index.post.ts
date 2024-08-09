import { insertAbsenTempatSchema } from "@/databases/hrd/absen_tempat/schema";
import { create } from "./service";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const user = getUser(event);

        const validate = insertAbsenTempatSchema.parse({
            ...body,
            tanggal: formatDate(body.tanggal),
            created_by: user!.id,
            updated_by: user!.id
        });
        const data =  await create(validate);
        return { data };
    } catch (error) {
        return handleError(event, error);
    }
})