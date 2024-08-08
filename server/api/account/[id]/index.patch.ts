import { updateAccountSchema } from "@/databases/account/schema";
import { updateAccount } from "../service";

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);
        const body = await readBody(event);
        const user = getUser(event);
        const validate = updateAccountSchema.parse({
            ...body,
            updated_by: user!.id
        });
        const data = await updateAccount(id, validate);
        return {
            message: 'Success Update Account',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
})