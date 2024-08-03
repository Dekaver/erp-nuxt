import { insertBrandSchema } from "./schema";
import { createBrand } from "./service";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const user = getUser(event);

        const validate = insertBrandSchema.parse({
            ...body,
            created_by: user!.id,
            updated_by: user!.id
        });
        const data =  await createBrand(validate);
        return { data };
    } catch (error) {
        return handleError(event, error);
    }
})