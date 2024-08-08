import { insertHariLiburTipeSchema } from "@/databases/hrd/hari-libur/tipe/schema";
import { createHariLiburTipe } from "./service";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const user = getUser(event);

        const validate = insertHariLiburTipeSchema.parse({
            ...body,
            created_by: user!.id,
            updated_by: user!.id
        });
        const data =  await createHariLiburTipe(validate);
        return { data };
    } catch (error) {
        return handleError(event, error);
    }
})