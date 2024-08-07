import { insertTopSchema } from "@/databases/top/schema";
import { createTop } from "./service";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const user = getUser(event);

        const validate = insertTopSchema.parse({
            ...body,
            created_by: user!.id,
            updated_by: user!.id
        });
        const data =  await createTop(validate);
        return { data };
    } catch (error) {
        return handleError(event, error);
    }
})