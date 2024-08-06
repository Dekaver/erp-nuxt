import { IncomingMessage } from 'http';
import { type H3Event } from 'h3';

export interface User {
    id: number;
    usernamenya: string;
    email: string;
    // Tambahkan properti lain sesuai kebutuhan
}

export interface RequestWithUser extends IncomingMessage {
    user?: User;
}

export function getUser(event: H3Event) {
    return (event.node.req as RequestWithUser).user;
}
