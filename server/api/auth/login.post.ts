import bcrypt from 'bcrypt';
import { and, eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { ValidationError } from '../../../libs/errors';
import { pengguna } from '../pengguna/schema';
import { pegawai } from '../pegawai/schema';

export default defineEventHandler(async (event) => {
    const { usernamenya, passwordnya } = await readBody(event);

    const [user] = await db
        .select({
            username: pengguna.usernamenya,
            password: pengguna.passwordnya,
            nama: pegawai.nama,
            email: pegawai.email,
            id_pegawai: pengguna.id_pegawai,
        })
        .from(pengguna)
        .innerJoin(pegawai, eq(pengguna.id_pegawai, pegawai.id))
        .where(and(eq(pengguna.usernamenya, usernamenya), eq(pengguna.enabled, true)));
    if (!user) {
        throw ValidationError('User tidak ditemukan');
    }
    // console.log(await readBody(event));
    if (!bcrypt.compareSync(passwordnya, user.password)) {
        throw ValidationError('Password salah');
    }

    const payload = {
        id: user.id_pegawai,
        usernamenya: user.username,
        nama: user.nama,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string);

    setCookie(event, 'token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 1, // 1 hari
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // atau config.SECURE
        sameSite: (process.env.SAME_SITE as 'lax' | 'strict' | 'none') || 'lax', // Atau konfigurasi yang diinginkan
    });



    // return sendRedirect(event, '/');
    return token;
});
