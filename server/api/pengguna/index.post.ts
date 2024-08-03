import { insertPenggunaSchema } from './schema';
import { createPengguna } from './service';

export default eventHandler(async (event) => {
    const body = await readBody(event);

    try {
        const validate = insertPenggunaSchema.parse({
            ...body,
        });

        const data = await createPengguna(validate);
        return { data };
    } catch (error: any) {
        return handleError(event, error);
    }
});
