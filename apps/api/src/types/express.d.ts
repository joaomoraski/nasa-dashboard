import { JwtPayload } from 'jsonwebtoken';

interface UserJwtPayload extends JwtPayload {
    id: number;
    email?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: string | UserJwtPayload;
        }
    }
}

export {};
