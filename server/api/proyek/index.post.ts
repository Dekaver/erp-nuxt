import { insertProyekSchema } from "@/databases/proyek/schema";
import { createProyek } from "./service";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const user = getUser(event);

        const validate = insertProyekSchema.parse({
            ...body,
            created_by: user!.id,
            updated_by: user!.id
        });
        const data =  await createProyek(validate);
        return { data };
    } catch (error) {
        return handleError(event, error);
    }
})