import jwt, { decode } from 'jsonwebtoken';
import { defineEventHandler } from 'h3';
import { IncomingMessage } from 'http';
import { getCookie } from 'h3';
import config from '../../libs/config';

interface User {
    id: number;
    username: string;
    email: string;
    // Tambahkan properti lain sesuai kebutuhan
}

interface RequestWithUser extends IncomingMessage {
    user?: User;
}

export default defineEventHandler(async (event) => {
    const publicRoutes = ['/api/auth/login', '/api/auth/login-google', '/login', '/api/auth/register', '/register'];

    if (publicRoutes.includes(event.node.req.url || '')) {
        // Jangan terapkan middleware pada rute login
        const token = getCookie(event, 'token');
        if (token) {
            try {
                jwt.verify(token, config.JWT_SECRET);
                return sendRedirect(event, '/');
            } catch (err) {
                return sendRedirect(event, '/login');
            }
        }
        return;
    }

    const token = getCookie(event, 'token');
    
    if (!token) {
        return sendRedirect(event, '/login');
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as User;
        
        (event.node.req as RequestWithUser).user = decoded;
    } catch (err) {
        return sendRedirect(event, '/login');
    }
});
