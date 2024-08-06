import bcrypt from 'bcrypt';
import { and, eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { ValidationError } from '../../../libs/errors';
import { pengguna } from '../pengguna/schema';
import { pegawai } from '../pegawai/schema';
import { getPenggunaPermissionStringById } from '../pengguna/permission/service';
import config from '../../../libs/config';
import { User } from '../../utils/helpers';

export default defineEventHandler(async (event) => {
    const tokenCookies = getCookie(event, 'token'); // ! keknya bagus kalau token disimpan dalam DB, jadi pas logout remove tokennya
    try {
        if (!tokenCookies) {
            throw null;
        }
        const decoded = jwt.verify(tokenCookies, config.JWT_SECRET) as User;

        const [user] = await db
            .select({
                id: pengguna.id,
                username: pengguna.usernamenya,
                password: pengguna.passwordnya,
                nama: pegawai.nama,
                email: pegawai.email,
                id_pegawai: pengguna.id_pegawai,
            })
            .from(pengguna)
            .innerJoin(pegawai, eq(pengguna.id_pegawai, pegawai.id))
            .where(and(eq(pengguna.usernamenya, decoded.usernamenya), eq(pengguna.enabled, true)));
        const permission = await getPenggunaPermissionStringById(user.id);

        if (!user) {
            throw ValidationError('User tidak ditemukan');
        }

        const payload = {
            id: user.id_pegawai,
            usernamenya: user.username,
            nama: user.nama,
        };

        return { user: payload, permission: permission.permission };
    } catch (err) {
        return sendRedirect(event, '/login');
    }
});
