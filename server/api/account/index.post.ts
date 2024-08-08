import { insertAccountSchema } from "@/databases/account/schema";
import { createAccount } from "./service";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const user = getUser(event);
        const validate = insertAccountSchema.parse({
            ...body,
            level: parseInt(body.level),
            created_by: user!.id,
            updated_by: user!.id
        });
        const data =  await createAccount(validate);
        return { data };
    } catch (error) {
        return handleError(event, error);
    }
})