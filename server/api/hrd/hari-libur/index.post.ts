import { insertHariLiburSchema } from "@/databases/hrd/hari-libur/schema";
import { createHariLibur } from "./service";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const user = getUser(event);

        const validate = insertHariLiburSchema.parse({
            ...body,
            tanggal: formatDate(body.tanggal),
            created_by: user!.id,
            updated_by: user!.id
        });
        const data =  await createHariLibur(validate);
        return { data };
    } catch (error) {
        return handleError(event, error);
    }
})