import { insertGudangSchema } from "@/databases/gudang/schema";
import { createGudang } from "./service";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const user = getUser(event);

        const validate = insertGudangSchema.parse({
            ...body,
            created_by: user!.id,
            updated_by: user!.id
        });
        const data =  await createGudang(validate);
        return { data };
    } catch (error) {
        return handleError(event, error);
    }
})