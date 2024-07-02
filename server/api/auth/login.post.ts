import bcrypt from 'bcrypt';
import { ValidationError } from '../../../libs/errors';
import db from '../../../libs/db';
import { pengguna } from '../../modules/pengguna/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const { usernamenya, passwordnya } = await readBody(event);
    console.log(usernamenya, passwordnya);
    const [user] = await db.select().from(pengguna).where(eq(pengguna.usernamenya, usernamenya));
    // console.log(await readBody(event));
    if (!bcrypt.compareSync(passwordnya, user.passwordnya)) {
        throw ValidationError('Password salah');
    }
    
    const payload = {
        id: user.id_pegawai,
        usernamenya: user.usernamenya,
        nama: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string);

    setCookie(event, 'token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 1, // 1 hari
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // atau config.SECURE
        sameSite: (process.env.SAME_SITE as 'lax' | 'strict' | 'none') || 'lax', // Atau konfigurasi yang diinginkan
    });
    return token;
});
