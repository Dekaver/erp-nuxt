import bcrypt from 'bcrypt';
import { getPenggunaById, updatePengguna } from "../service";
import { updatePenggunaSchema } from '../schema';

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params!.id);
        const body = await readBody(event);
        if (body.passwordnya) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(body.passwordnya, salt);
            body.passwordnya = hash;
        }else{
            const oldPengguna = await getPenggunaById(body.id);
            body.passwordnya = oldPengguna.passwordnya
        }

        const validate = updatePenggunaSchema.parse({
            ...body
        });

        const data = await updatePengguna(id, validate);
        return {
            message: 'Success Update Brand',
            data,
        };
    } catch (error) {
        return handleError(event, error);
    }
})