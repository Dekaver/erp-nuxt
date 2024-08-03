import { updateBrandSchema } from "../schema";
import { updateBrand } from "../service";

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);
        const body = await readBody(event);
        const user = getUser(event);
        const validate = updateBrandSchema.parse({
            ...body,
            updated_by: user!.id
        });
        const data = await updateBrand(id, validate);
        return {
            message: 'Success Update Brand',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
})