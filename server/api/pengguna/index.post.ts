import bcrypt from 'bcrypt';
import { insertPenggunaSchema } from '@/databases/pengguna/schema';
import { createPengguna, getPenggunaById } from './service';

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
