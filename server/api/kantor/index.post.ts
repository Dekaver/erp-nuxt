import { insertKantorSchema } from "@/databases/kantor/schema";
import { createKantor } from "./service";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const user = getUser(event);

        const validate = insertKantorSchema.parse({
            ...body,
            created_by: user!.id,
            updated_by: user!.id
        });
        const data =  await createKantor(validate);
        return { data };
    } catch (error) {
        return handleError(event, error);
    }
})