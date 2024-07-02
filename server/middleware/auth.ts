import { eq } from 'drizzle-orm';
import db from '../../libs/db';
import jwt from 'jsonwebtoken';
import { pengguna } from '../modules/pengguna/schema';
import config from '../../libs/config';

export default defineEventHandler(async (event) => {
    // const [data] = await db.select()
    // .from(pengguna)
    // .where(eq(pengguna.usernamenya, 'admin'));

    const publicRoutes = ['/api/auth/login', '/login'];
    console.log(event.path);
    

    if (publicRoutes.includes(event.path || '')) {
        // Jangan terapkan middleware pada rute login
        return;
    }

    const token = getCookie(event, 'token');
    if (!token) {
        return {
            message: 'Unauthorized',
        };
    }
    const cookies = parseCookies(event)
    console.log(cookies, "ini cookies");
    

    // return { cookies }
    // jwt.verify(token, config.JWT_SECRET, (err: any, decoded: any) => {
    //             if (err) {
    //                 return {
    //                     message: "Unauthorized",
    //                 };
    //             }
    //             req.user = decoded;
    //             next();
    //         });
});
